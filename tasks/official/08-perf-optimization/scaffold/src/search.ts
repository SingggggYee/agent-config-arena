export interface SearchResult {
  id: string;
  score: number;
  matches: string[];
}

// A corpus of documents for the search engine
const corpus: Array<{ id: string; text: string }> = [
  { id: "doc-001", text: "Introduction to machine learning algorithms and neural networks for beginners in computer science" },
  { id: "doc-002", text: "Advanced deep learning techniques with convolutional neural networks and recurrent architectures" },
  { id: "doc-003", text: "Natural language processing fundamentals and text classification methods using transformers" },
  { id: "doc-004", text: "Computer vision applications using deep learning and image recognition with neural networks" },
  { id: "doc-005", text: "Reinforcement learning strategies for game playing artificial intelligence and robotics control" },
  { id: "doc-006", text: "Data preprocessing and feature engineering for machine learning pipelines and model training" },
  { id: "doc-007", text: "Statistical methods for data analysis and hypothesis testing in experimental research design" },
  { id: "doc-008", text: "Database optimization techniques and query performance tuning for large scale applications" },
  { id: "doc-009", text: "Web development with modern JavaScript frameworks and libraries for frontend engineering" },
  { id: "doc-010", text: "Cloud computing architecture and distributed systems design patterns for scalable services" },
  { id: "doc-011", text: "Microservices architecture best practices and service mesh implementation with Kubernetes" },
  { id: "doc-012", text: "Container orchestration with Kubernetes and Docker deployment strategies for production" },
  { id: "doc-013", text: "Continuous integration and continuous deployment pipeline automation for software delivery" },
  { id: "doc-014", text: "Software testing methodologies including unit testing and integration testing best practices" },
  { id: "doc-015", text: "Agile project management and scrum framework implementation guide for development teams" },
  { id: "doc-016", text: "Cybersecurity fundamentals and network security best practices for enterprise applications" },
  { id: "doc-017", text: "Encryption algorithms and cryptographic protocols for secure communication systems design" },
  { id: "doc-018", text: "Mobile application development for iOS and Android platforms using cross platform frameworks" },
  { id: "doc-019", text: "User interface design principles and user experience optimization for web applications" },
  { id: "doc-020", text: "Responsive web design with CSS grid and flexbox layouts for modern user interfaces" },
  { id: "doc-021", text: "API design best practices and RESTful service architecture for distributed systems" },
  { id: "doc-022", text: "GraphQL query language and schema design for modern APIs and data fetching patterns" },
  { id: "doc-023", text: "Real-time data streaming with Apache Kafka and event driven architecture for analytics" },
  { id: "doc-024", text: "Big data processing with Apache Spark and Hadoop ecosystem for distributed computing" },
  { id: "doc-025", text: "Time series analysis and forecasting with statistical models for business intelligence" },
  { id: "doc-026", text: "Recommendation systems using collaborative filtering and content based methods for personalization" },
  { id: "doc-027", text: "Search engine optimization and web crawler implementation techniques for information retrieval" },
  { id: "doc-028", text: "Compiler design and programming language implementation fundamentals for systems engineering" },
  { id: "doc-029", text: "Operating system kernel development and memory management for embedded systems programming" },
  { id: "doc-030", text: "Network protocol design and TCP IP stack implementation for distributed communication" },
  { id: "doc-031", text: "Functional programming paradigms with Haskell and category theory for mathematical computing" },
  { id: "doc-032", text: "Object oriented design patterns and SOLID principles in practice for software engineering" },
  { id: "doc-033", text: "Version control systems and Git workflow strategies for teams and collaborative development" },
  { id: "doc-034", text: "Linux system administration and shell scripting automation for server management tasks" },
  { id: "doc-035", text: "Performance monitoring and application profiling techniques for production system optimization" },
  { id: "doc-036", text: "Distributed database systems and consistency models for high availability data storage" },
  { id: "doc-037", text: "Message queue systems and asynchronous processing patterns for event driven microservices" },
  { id: "doc-038", text: "Serverless computing and function as a service platforms for cloud native applications" },
  { id: "doc-039", text: "Infrastructure as code with Terraform and configuration management for deployment automation" },
  { id: "doc-040", text: "Monitoring and observability with Prometheus and Grafana dashboards for system reliability" },
  { id: "doc-041", text: "Log aggregation and analysis with Elasticsearch and Kibana for operational intelligence" },
  { id: "doc-042", text: "Blockchain technology and decentralized application development for distributed ledger systems" },
  { id: "doc-043", text: "Quantum computing fundamentals and quantum algorithm design for next generation processors" },
  { id: "doc-044", text: "Internet of things sensor networks and edge computing for smart device management" },
  { id: "doc-045", text: "Augmented reality and virtual reality application development for immersive experiences" },
  { id: "doc-046", text: "Speech recognition and audio processing with deep learning for natural language understanding" },
  { id: "doc-047", text: "Robotics control systems and autonomous navigation algorithms for mobile robot platforms" },
  { id: "doc-048", text: "Bioinformatics algorithms for genome sequence analysis and protein structure prediction" },
  { id: "doc-049", text: "Geographic information systems and spatial data processing for location based services" },
  { id: "doc-050", text: "Game engine architecture and real time rendering techniques for interactive entertainment" },
  { id: "doc-051", text: "Parallel computing and GPU programming with CUDA for high performance scientific computing" },
  { id: "doc-052", text: "Cache optimization strategies and memory hierarchy design for processor architecture" },
  { id: "doc-053", text: "Load balancing algorithms and high availability system design for web scale applications" },
  { id: "doc-054", text: "Authentication and authorization patterns for web applications and API security management" },
  { id: "doc-055", text: "Data warehouse design and ETL pipeline implementation for business analytics platforms" },
  { id: "doc-056", text: "Neural network pruning and model compression techniques for efficient inference on edge devices" },
  { id: "doc-057", text: "Attention mechanisms and transformer architectures for sequence to sequence learning tasks" },
  { id: "doc-058", text: "Federated learning and privacy preserving machine learning for distributed data processing" },
  { id: "doc-059", text: "Transfer learning and domain adaptation strategies for limited training data scenarios" },
  { id: "doc-060", text: "Generative adversarial networks for image synthesis and data augmentation techniques" },
  { id: "doc-061", text: "Knowledge graph construction and reasoning for semantic web and information extraction" },
  { id: "doc-062", text: "AutoML and neural architecture search for automated machine learning pipeline optimization" },
  { id: "doc-063", text: "Explainable artificial intelligence and model interpretability for trustworthy AI systems" },
  { id: "doc-064", text: "Multi-agent systems and game theory for cooperative and competitive strategy optimization" },
  { id: "doc-065", text: "Bayesian optimization and probabilistic programming for uncertainty quantification in models" },
  { id: "doc-066", text: "Graph neural networks and relational learning for social network analysis and prediction" },
  { id: "doc-067", text: "Embedded systems programming with real time operating systems for safety critical applications" },
  { id: "doc-068", text: "Digital signal processing and filter design for audio and communication systems engineering" },
  { id: "doc-069", text: "Control theory and system identification for industrial automation and process control" },
  { id: "doc-070", text: "Formal verification and model checking for software correctness and reliability assurance" },
  { id: "doc-071", text: "Numerical methods and scientific computing for solving differential equations and simulations" },
  { id: "doc-072", text: "Information theory and coding for reliable data transmission over noisy communication channels" },
  { id: "doc-073", text: "Computational geometry algorithms for computer graphics and geographic data processing" },
  { id: "doc-074", text: "Concurrent programming and lock free data structures for multi threaded applications" },
  { id: "doc-075", text: "Reverse engineering and binary analysis techniques for malware detection and security research" },
  { id: "doc-076", text: "Event sourcing and CQRS patterns for building scalable event driven application architectures" },
  { id: "doc-077", text: "Service discovery and API gateway patterns for microservices communication and routing" },
  { id: "doc-078", text: "Chaos engineering and resilience testing for distributed systems reliability improvement" },
  { id: "doc-079", text: "Feature flag management and progressive delivery for safe software release strategies" },
  { id: "doc-080", text: "Site reliability engineering and incident management for production system operations" },
];

/**
 * Computes the Levenshtein edit distance between two strings.
 * Used for fuzzy matching - deliberately unoptimized.
 */
function editDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * A deliberately naive text search implementation.
 * Current performance: ~500 ops/sec
 * Target performance: 10,000 ops/sec
 */
export class TextIndex {
  private documents: Array<{ id: string; text: string }> = [];

  constructor() {
    // Pre-load corpus documents
    for (const doc of corpus) {
      this.addDocument(doc.id, doc.text);
    }
  }

  addDocument(id: string, text: string): void {
    this.documents.push({ id, text });
  }

  search(query: string): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    // Deliberately naive: split query into words every single time
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    // For each document, do an expensive full scan
    for (const doc of this.documents) {
      // Deliberately naive: toLowerCase and split on every search call
      const docText = doc.text.toLowerCase();
      const docWords = docText.split(/\s+/);

      const matchedWords: Set<string> = new Set();
      let score = 0;

      // Deliberately naive: nested loop comparison O(q * d) per document
      for (const qWord of queryWords) {
        for (const dWord of docWords) {
          // Deliberately naive: full string comparison with extra allocations
          const normalizedQuery = qWord.trim().toLowerCase();
          const normalizedDoc = dWord.trim().toLowerCase();

          if (normalizedDoc === normalizedQuery) {
            matchedWords.add(qWord);
            score += 1;
          }

          // Partial match: check if document word contains query word
          if (normalizedDoc.includes(normalizedQuery) && normalizedQuery.length >= 3) {
            if (!matchedWords.has(qWord)) {
              matchedWords.add(qWord + " (partial)");
              score += 0.5;
            }
          }

          // Deliberately naive: compute edit distance for fuzzy matching
          // This is O(m*n) per word pair, making the overall search extremely slow
          if (normalizedQuery.length >= 4) {
            const dist = editDistance(normalizedQuery, normalizedDoc);
            if (dist <= 1 && dist > 0) {
              if (!matchedWords.has(qWord) && !matchedWords.has(qWord + " (partial)")) {
                matchedWords.add(qWord + " (fuzzy)");
                score += 0.25;
              }
            }
          }
        }
      }

      // Deliberately naive: extra unnecessary work
      // Re-check all matches for "relevance boosting"
      if (matchedWords.size > 0) {
        let boost = 0;
        for (const matched of matchedWords) {
          for (const qWord of queryWords) {
            const cleanMatch = matched.replace(" (partial)", "").replace(" (fuzzy)", "");
            if (cleanMatch.toLowerCase() === qWord.toLowerCase()) {
              boost += 0.1;
            }
          }
        }
        score += boost;

        // Deliberately naive: compute character-level similarity for each match
        for (const matched of matchedWords) {
          const cleanMatch = matched.replace(" (partial)", "").replace(" (fuzzy)", "");
          for (let i = 0; i < docText.length - cleanMatch.length; i++) {
            const substr = docText.substring(i, i + cleanMatch.length);
            if (substr === cleanMatch) {
              score += 0.01;
            }
          }
        }

        // Deliberately naive: create a new array from the set, sort it, map it
        const matchArray = Array.from(matchedWords)
          .map(m => m.replace(" (partial)", "").replace(" (fuzzy)", ""))
          .sort()
          .filter((v, i, a) => a.indexOf(v) === i);

        results.push({
          id: doc.id,
          score: Math.round(score * 100) / 100,
          matches: matchArray,
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => {
      const scoreA = a.score;
      const scoreB = b.score;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.id.localeCompare(b.id);
    });

    return results;
  }
}
