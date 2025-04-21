'use client';

import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';

function formatSegment(segment) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export default function ActiveLastBreadcrumb({ links }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const autoLinks = links || pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: formatSegment(segment), href };
  });

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        
        top: 63,
        zIndex: 900, // Make sure it stays above other elements
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          fontSize: '0.875rem',
          '& .MuiTypography-root': {
            fontWeight: 500,
          },
          '& .MuiLink-root': {
            color: 'grey',
            fontWeight: 500,
          },
        }}
      >
        <NextLink href="/" passHref legacyBehavior>
          <MuiLink underline="hover" color="inherit" component="a">
            Home
          </MuiLink>
        </NextLink>

        {autoLinks.map((item, index) => {
          const isLast = index === autoLinks.length - 1;
          return isLast ? (
            <Typography key={index} color="#610bee">
              {item.label}
            </Typography>
          ) : (
            <NextLink key={index} href={item.href} passHref legacyBehavior>
              <MuiLink underline="hover" color="inherit" component="a">
                {item.label}
              </MuiLink>
            </NextLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
