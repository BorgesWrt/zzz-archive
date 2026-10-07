import type { Kind } from './domain';
export function EntityIcon({kind}:{kind:Kind}){
 const paths:Record<Kind,React.ReactNode>={
 agent:<><circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></>,
 build:<><path d="M4 7h16M4 17h16M8 3v8M16 13v8"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="17" r="2"/></>,
 mode:<><path d="m5 4 15 8-15 8Z"/></>,engine:<><path d="m14 2-9 12h6l-1 8 9-12h-6Z"/></>,
 disc:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="m16 6 2 2M6 16l2 2"/></>,
 bangboo:<><path d="M7 7V2M17 7V2M5 7h14v13H5Z"/><path d="M8 12h1M15 12h1M9 16h6"/></>,
 team:<><circle cx="12" cy="7" r="3"/><circle cx="4" cy="10" r="2"/><circle cx="20" cy="10" r="2"/><path d="M7 21v-3a5 5 0 0 1 10 0v3M1 20v-3h3M23 20v-3h-3"/></>,
 faction:<><path d="M4 21V8l8-5 8 5v13M8 21v-5h8v5M8 9h1m6 0h1M8 12h1m6 0h1"/></>,
 enemy:<><path d="M3 5 8 8h8l5-3-2 12-7 5-7-5Z"/><path d="m7 12 3 2m7-2-3 2M10 18h4"/></>,
 stage:<><path d="M3 20h18M5 20v-6h5v-5h5V4h5v16"/></>,
 patch:<><path d="M5 3h14v18H5Z"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
 event:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-12 4 2 2 4-4"/></>,
 guide:<><path d="M3 4h6l3 3 3-3h6v16h-6l-3 2-3-2H3ZM12 7v15"/></>};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>
}
export function ArchiveMark(){return <svg viewBox="0 0 48 48" aria-hidden="true" className="archive-mark"><path d="M7 7h34v8L17 33h24v8H7v-8l24-18H7Z" fill="currentColor"/><path d="M7 21h13M28 27h13" stroke="#101416" strokeWidth="3"/></svg>}
