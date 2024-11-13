import mammoth from 'mammoth';
import type { DocumentAnalysis } from '../types';

export async function analyzeDocument(file: File, apiKey: string): Promise<DocumentAnalysis> {
  if (!apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  try {
    const content = await readFileContent(file);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Legal Document Analyzer'
      },
      body: JSON.stringify({
        model: 'liquid/lfm-40b:free',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document analyzer. Extract key information from the document and format the response as a JSON object with the following keys: counterpartyName, documentType, effectiveDate, agreementDate, expirationDate, employeeSolicitation, status, jurisdiction, governingLaw, confidentialityTerm.'
          },
          {
            role: 'user',
            content: `Analyze this legal document and provide the analysis in JSON format:

${content}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to analyze document');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenRouter API');
    }

    try {
      // Attempt to parse the response as JSON first
      const jsonResponse = JSON.parse(data.choices[0].message.content);
      return {
        counterpartyName: jsonResponse.counterpartyName || '',
        documentType: jsonResponse.documentType || '',
        effectiveDate: jsonResponse.effectiveDate || '',
        agreementDate: jsonResponse.agreementDate || '',
        expirationDate: jsonResponse.expirationDate || '',
        employeeSolicitation: jsonResponse.employeeSolicitation || '',
        status: jsonResponse.status || '',
        jurisdiction: jsonResponse.jurisdiction || '',
        governingLaw: jsonResponse.governingLaw || '',
        confidentialityTerm: jsonResponse.confidentialityTerm || ''
      };
    } catch (e) {
      // Fallback to regex parsing if JSON parsing fails
      return parseAnalysisResponse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze document');
  }
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (file.type.includes('word')) {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else {
          resolve(e.target?.result as string);
        }
      } catch (error) {
        reject(new Error('Failed to read document content'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type.includes('word')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function parseAnalysisResponse(content: string): DocumentAnalysis {
  const fields = [
    'counterpartyName',
    'documentType',
    'effectiveDate',
    'agreementDate',
    'expirationDate',
    'employeeSolicitation',
    'status',
    'jurisdiction',
    'governingLaw',
    'confidentialityTerm'
  ];

  const result: Partial<DocumentAnalysis> = {};
  
  fields.forEach(field => {
    const value = extractField(content, field);
    result[field as keyof DocumentAnalysis] = value;
  });

  return result as DocumentAnalysis;
}

function extractField(content: string, field: string): string {
  const fieldMap: Record<string, string> = {
    'counterpartyName': 'Counterparty Name',
    'documentType': 'Document Type',
    'effectiveDate': 'Effective Date',
    'agreementDate': 'Agreement Date',
    'expirationDate': 'Expiration Date',
    'employeeSolicitation': 'Employee Solicitation',
    'status': 'Status',
    'jurisdiction': 'Jurisdiction',
    'governingLaw': 'Governing Law',
    'confidentialityTerm': 'Confidentiality Term'
  };

  const displayField = fieldMap[field];
  const regex = new RegExp(`${displayField}:?\\s*([^\\n]+)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}