import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Terminal from '../../components/Terminal';
import CodeCard from '../../components/CodeCard';
import { profile, projects } from '../../lib/site';
export const source = {
  terminal: renderToStaticMarkup(<Terminal />),
  code: renderToStaticMarkup(<CodeCard />),
  profile,
  projects,
};
