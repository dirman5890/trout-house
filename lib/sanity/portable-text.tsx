import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import type { PortableTextValue } from './types';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-charcoal/80 leading-relaxed text-pretty">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-1 text-charcoal/80 leading-relaxed">{children}</ul>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-charcoal">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href || '#';
      const external: boolean = value?.external || /^https?:\/\//.test(href);
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-forest"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className="underline underline-offset-4 hover:text-forest">
          {children}
        </Link>
      );
    },
  },
};

export function PortableTextBody({
  value,
  className,
}: {
  value?: PortableTextValue;
  className?: string;
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className={['space-y-4 max-w-prose', className].filter(Boolean).join(' ')}>
      {/* PortableText typing is loose — cast at the boundary, narrow inside */}
      <PortableText value={value as never} components={components} />
    </div>
  );
}
