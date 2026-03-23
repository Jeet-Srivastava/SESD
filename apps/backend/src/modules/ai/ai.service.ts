export interface ComplaintIntelligence {
  category: string;
  hint: string;
}

export interface IAiProvider {
  classifyComplaint(title: string, description: string): Promise<ComplaintIntelligence>;
  suggestPriority(title: string, description: string): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>;
}

class MockAiProvider implements IAiProvider {
  // mock LLM API delay
  private async simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));
  }

  public async classifyComplaint(title: string, description: string): Promise<ComplaintIntelligence> {
    await this.simulateDelay();
    const combined = `${title} ${description}`.toLowerCase();
    
    if (combined.includes('water') || combined.includes('leak') || combined.includes('plumb')) {
      return { category: 'PLUMBING', hint: 'Check the pipeline and valve. LLM suggestion: shut off the water source first.' };
    }
    if (combined.includes('light') || combined.includes('electric') || combined.includes('fan')) {
      return { category: 'ELECTRICAL', hint: 'Inspect the distribution panel and room wiring. LLM suggestion: check whether the breaker has tripped.' };
    }
    if (combined.includes('wifi') || combined.includes('internet') || combined.includes('network')) {
      return { category: 'IT_SUPPORT', hint: 'Restart the router and run a ping test. LLM suggestion: check for an ISP outage.' };
    }
    if (combined.includes('clean') || combined.includes('garbage')) {
      return { category: 'HOUSEKEEPING', hint: 'Capture photos of the area and dispatch housekeeping staff.' };
    }
    return { category: 'GENERAL', hint: 'Schedule a site visit to confirm the root cause.' };
  }

  public async suggestPriority(title: string, description: string): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> {
    await this.simulateDelay();
    const combined = `${title} ${description}`.toLowerCase();
    
    // Pattern matching logic (Mock LLM Engine)
    if (combined.match(/\b(fire|shock|spark|urgent|emergency|flood)\b/)) return 'CRITICAL';
    if (combined.match(/\b(no water|outage|broken|stopped|not working)\b/)) return 'HIGH';
    if (combined.match(/\b(slow|noise|dirty|clean)\b/)) return 'LOW';
    
    return 'MEDIUM';
  }
}

export class AiService {
  constructor(private readonly provider: IAiProvider = new MockAiProvider()) {}

  public classify(title: string, description: string): Promise<ComplaintIntelligence> {
    return this.provider.classifyComplaint(title, description);
  }

  public detectPriority(title: string, description: string): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> {
    return this.provider.suggestPriority(title, description);
  }
}
