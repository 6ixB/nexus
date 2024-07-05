import * as React from 'react';
import { SVGProps } from 'react';

const Nexus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 33"
    {...props}
  >
    <path
      fill="url(#a)"
      fillRule="evenodd"
      d="m12.28 0-1.335 1.797.725.676 2.325.89L12.28 0ZM7.896 5.852l1.368-1.814 1.846 1.566 5.291 2.39 1.78 3.462-8.027-2.983-2.258-2.621Zm-1.45 1.961-.99 1.319 3.28 5.225 12.89 3.742-1.5-2.885L9.38 11.54 6.445 7.813Zm16.35 12.544-14.62-3.824-3.61-6.214-.874 1.186 3.759 7.517L24 22.698M2.819 12.659l-.627.841 4.253 11.027 14.308 2.044 3.23-1.269-16.862-3.395-4.302-9.248ZM1.4 14.54l-.51.692 4.384 14.027 7.038.56 4.302-1.664L5.77 26.769 1.401 14.54ZM.297 16.021 0 16.418 4.401 32.9l3.462-1.368-2.95-.181-4.616-15.33Z"
      clipRule="evenodd"
    />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        x2={24}
        y1={16.451}
        y2={16.451}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#006CFF" />
        <stop offset={1} stopColor="#0DF1FF" />
      </linearGradient>
    </defs>
  </svg>
);
export default Nexus;
