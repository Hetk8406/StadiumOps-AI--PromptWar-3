// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders children content correctly', () => {
    render(<Badge>Active Status</Badge>);
    const element = screen.getByText('Active Status');
    expect(element).not.toBeNull();
  });

  it('applies the correct default neutral class', () => {
    render(<Badge>Neutral Badge</Badge>);
    const element = screen.getByText('Neutral Badge');
    expect(element.className).toContain('bg-bg-panel');
  });

  it('applies the correct success variant class', () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const element = screen.getByText('Success Badge');
    expect(element.className).toContain('text-stadium-success');
  });
});
