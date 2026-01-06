'use client';

import { useEffect, useRef, useState } from 'react';

interface EventsEmbedProps {
  embedCode: string;
}

/**
 * Client component that safely renders third-party embed code including scripts.
 *
 * This component:
 * 1. Uses regex to extract non-script HTML (SSR-safe)
 * 2. Renders the container HTML immediately
 * 3. Dynamically loads and executes scripts after mount on the client
 */
export function EventsEmbed({ embedCode }: EventsEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptsLoadedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Extract non-script HTML using regex (SSR-safe)
  const getNonScriptHtml = (html: string): string => {
    // Remove script tags using regex
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  };

  // Extract script tags info using regex (SSR-safe)
  const extractScripts = (html: string): Array<{ src?: string; content?: string; attributes: Record<string, string> }> => {
    const scripts: Array<{ src?: string; content?: string; attributes: Record<string, string> }> = [];
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
      const attributesStr = match[1];
      const content = match[2].trim();
      const attributes: Record<string, string> = {};

      // Parse attributes
      const attrRegex = /(\S+)=["']?([^"'\s>]+)["']?/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }

      scripts.push({
        src: attributes.src,
        content: content || undefined,
        attributes,
      });
    }

    return scripts;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || scriptsLoadedRef.current) return;

    const scripts = extractScripts(embedCode);

    // Load each script
    scripts.forEach((scriptInfo) => {
      const script = document.createElement('script');

      // Copy all attributes
      Object.entries(scriptInfo.attributes).forEach(([key, value]) => {
        if (key !== 'src') {
          script.setAttribute(key, value);
        }
      });

      if (scriptInfo.src) {
        script.src = scriptInfo.src;
        // Append external scripts to body
        document.body.appendChild(script);
      } else if (scriptInfo.content) {
        script.textContent = scriptInfo.content;
        containerRef.current?.appendChild(script);
      }
    });

    scriptsLoadedRef.current = true;

    // Cleanup function to remove scripts on unmount
    return () => {
      const scripts = extractScripts(embedCode);
      scripts.forEach((scriptInfo) => {
        if (scriptInfo.src) {
          const loadedScript = document.querySelector(`script[src="${scriptInfo.src}"]`);
          loadedScript?.remove();
        }
      });
    };
  }, [mounted, embedCode]);

  const htmlContent = getNonScriptHtml(embedCode);

  return (
    <div
      ref={containerRef}
      className="events-embed"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
