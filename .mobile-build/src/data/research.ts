export type Paper = {
  slug: string;
  kind: 'ieee' | 'review';
  badge: string;
  title: string;
  venue: string;
  year: string;
  coAuthored?: boolean;
  result?: { value: string; label: string };
  abstract: string;
  tags: string[];
  file: string;
};

export const papers: Paper[] = [
  {
    slug: 'parkinsons-detection',
    kind: 'ieee',
    badge: 'IEEE format',
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
    year: '2026',
    coAuthored: true,
    result: { value: '99.2%', label: 'external validation accuracy' },
    abstract:
      "An end-to-end hybrid framework for automated, non-invasive Parkinson's Disease detection from digitized hand-drawn graphomotor biomarkers. It combines deep feature extraction from multiple CNNs (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability.",
    tags: ['Deep Learning', 'Multi-CNN', 'Genetic Algorithm', 'XGBoost', 'SHAP', 'Medical AI'],
    file: '/papers/parkinsons-detection-handwriting.pdf',
  },
  {
    slug: 'bert-news-recommendation',
    kind: 'ieee',
    badge: 'IEEE format',
    title: 'Solving Information Overload: Using BERT to Recommend News Articles Related to User Interest',
    venue: 'CS666 · LIU Brooklyn',
    year: '2025',
    coAuthored: true,
    result: { value: 'SBERT', label: 'semantic ranking over a rich user profile' },
    abstract:
      'A content-based recommendation system that uses Sentence-BERT embeddings and a rich user profile built from explicit preferences, liked articles and reading history. Cosine similarity over all-MiniLM-L6-v2 vectors drives personalized news ranking, avoiding the limits of keyword matching.',
    tags: ['NLP', 'Sentence-BERT', 'Recommender Systems', 'Information Retrieval'],
    file: '/papers/bert-news-recommendation.pdf',
  },
  {
    slug: 'pytorch-vs-tensorflow',
    kind: 'review',
    badge: 'survey',
    title: 'A Comparative Survey of PyTorch vs. TensorFlow for Deep Learning: Usability, Performance, and Deployment',
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
    year: '2026',
    abstract:
      'Compares the two dominant deep learning frameworks across developer experience, training and inference efficiency, deployment, and ecosystem. Both deliver strong results, but PyTorch leans toward simplicity and research while TensorFlow leans toward a complete production ecosystem, so the right choice depends on which trade-offs matter most.',
    tags: ['PyTorch', 'TensorFlow', 'Deep Learning'],
    file: '/papers/pytorch-vs-tensorflow-survey.pdf',
  },
  {
    slug: 'tensorflow-review',
    kind: 'review',
    badge: 'paper review',
    title: 'TensorFlow: A System for Large-Scale Machine Learning',
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
    year: '2026',
    abstract:
      'A structured review of the TensorFlow paper: its single dataflow-graph model for computation and mutable state, extensibility through user-level libraries, distributed training, and benchmark performance on image classification and language modeling across CPUs, GPUs and TPUs.',
    tags: ['TensorFlow', 'Dataflow Graphs', 'Distributed Systems'],
    file: '/papers/tensorflow-system-review.pdf',
  },
  {
    slug: 'microservices',
    kind: 'review',
    badge: 'term paper',
    title:
      'Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications',
    venue: 'System Design and Analysis · LIU Brooklyn',
    year: '2024',
    abstract:
      'A qualitative analysis of microservices and distributed systems through case studies of Netflix, Uber and ChatGPT, showing how system analysis and design principles (modularity, scalability and fault tolerance) address the limits of monolithic architectures at production scale.',
    tags: ['Microservices', 'Distributed Systems', 'System Design'],
    file: '/papers/microservices-distributed-systems.pdf',
  },
];

export const awards = [
  'Excellence Award in Graduate Computer Science, LIU Brooklyn',
  'Kotlin Professional Certificate, JetBrains',
  'Member of Google Developer Group @ Long Island University',
];
