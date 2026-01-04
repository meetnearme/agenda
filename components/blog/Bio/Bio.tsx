import React from 'react';

interface BioProps {
  className?: string;
  authorName?: string;
  authorBio?: string;
}

const Bio: React.FC<BioProps> = ({
  className = '',
  authorName = 'The Editor',
  authorBio = 'Your weekly guide to local events and community happenings.',
}) => {
  return (
    <div
      className={`mb-8 rounded-lg border border-border bg-card p-6 ${className}`}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Written by{' '}
        <strong className="font-semibold text-foreground">{authorName}</strong>{' '}
        — {authorBio}
      </p>
    </div>
  );
};

export default Bio;

