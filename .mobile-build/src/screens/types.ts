import type { Portfolio } from '../data/model';
import type { Paper } from '../data/research';

export type Project = Portfolio['projects'][number];
export type Detail = { kind: 'project'; value: Project } | { kind: 'paper'; value: Paper } | null;
