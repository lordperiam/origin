/**
 * Type definitions for debate page components
 * DO NOT MODIFY without updating all implementations
 */

export interface DebatePageParams {
  params: {
    debateId: string;
  }
}

export interface DebateData {
  id: string;
  title: string;
  description?: string;
  dateCreated: string;
  // Add other debate properties
}

export interface TranscriptData {
  id: string;
  debateId: string;
  content: string;
  // Add other transcript properties
}

export interface AnalysisData {
  id: string;
  debateId: string;
  summary: string;
  keyPoints: string[];
  // Add other analysis properties
}