import{c as e,p as t,r as n}from"./index-BBUx9t8P.js";import{o as r,r as i,t as a}from"./MainLayout-ycz_Hy9R.js";import{d as o}from"./proxy-Ca7g3fsN.js";import{t as s}from"./eye-CBGvmIW8.js";import{n as c,t as l}from"./search-CxYm8fQS.js";import{n as u,t as d}from"./Modal-PTKtVsK2.js";import{n as f,t as p}from"./lib-De9eVw8J.js";import{n as m,t as h}from"./settingsService-Nh61w9OC.js";import{t as g}from"./Button-Be5-pTgc.js";var _=o(`download`,[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]),v=o(`tag`,[[`path`,{d:`M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z`,key:`vktsd0`}],[`circle`,{cx:`7.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`kqv944`}]]),y=t(e(),1),b=n();function x(){let[e,t]=(0,y.useState)([]),[n,o]=(0,y.useState)(!0),[x,S]=(0,y.useState)(``),[C,w]=(0,y.useState)(`All`),[T,E]=(0,y.useState)([]),[D,O]=(0,y.useState)(null),k=async()=>{o(!0);try{let e=await m();t(e),E([`All`,...new Set(e.map(e=>e.subject).filter(Boolean))])}catch(e){console.error(`Failed to load saved answers:`,e)}finally{o(!1)}};(0,y.useEffect)(()=>{k()},[]);let A=async(e,t)=>{if(t.stopPropagation(),window.confirm(`Delete this saved answer?`))try{await h(e),D?.id===e&&O(null),await k()}catch(e){alert(`Delete failed: `+(e.response?.data?.detail||e.message))}},j=()=>{if(!D)return;let e=document.getElementById(`pdf-print-area`);if(!e)return;let t=e.innerHTML,n=window.open(``,`_blank`);n.document.write(`
      <html>
        <head>
          <title>${D.title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              padding: 40px; 
              color: #1e293b; 
              line-height: 1.7; 
            }
            h1 { 
              font-size: 24px;
              color: #0f172a; 
              margin-bottom: 6px; 
              border-bottom: 2px solid #10b981;
              padding-bottom: 12px;
            }
            .meta {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 24px;
            }
            p { margin-bottom: 16px; }
            ul, ol { padding-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 6px; }
            code { 
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
              background-color: #f1f5f9; 
              padding: 2px 6px; 
              border-radius: 4px; 
              font-size: 13px;
              color: #0f766e;
            }
            pre { 
              background-color: #f8fafc; 
              border: 1px solid #e2e8f0;
              border-radius: 8px; 
              padding: 16px; 
              overflow-x: auto; 
              margin-bottom: 20px;
            }
            pre code { 
              background-color: transparent; 
              padding: 0; 
              color: #334155;
            }
            blockquote {
              border-left: 4px solid #10b981;
              padding-left: 16px;
              margin: 16px 0;
              color: #475569;
              font-style: italic;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <h1>${D.title}</h1>
          <div class="meta">
            Subject: <strong>${D.subject}</strong> &nbsp;|&nbsp; 
            Type: <strong>${D.tags||`normal`}</strong> &nbsp;|&nbsp; 
            Saved on: ${new Date(D.created_at).toLocaleDateString()}
          </div>
          <div>
            ${t}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          <\/script>
        </body>
      </html>
    `),n.document.close()},M=e.filter(e=>{let t=e.title.toLowerCase().includes(x.toLowerCase())||e.content.toLowerCase().includes(x.toLowerCase()),n=C===`All`||e.subject===C;return t&&n});return(0,b.jsxs)(a,{children:[(0,b.jsxs)(`div`,{className:`p-6 border-b border-[#1E293B]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`,children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,b.jsx)(`div`,{className:`w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400`,children:(0,b.jsx)(r,{size:20})}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h1`,{className:`text-xl font-display font-bold text-white`,children:`Saved Answers`}),(0,b.jsx)(`p`,{className:`text-xs text-slate-500`,children:`View and export answers bookmarked during RAG learning cycles`})]})]}),(0,b.jsx)(g,{variant:`secondary`,onClick:k,icon:(0,b.jsx)(u,{size:14}),size:`sm`,children:`Refresh`})]}),(0,b.jsxs)(`div`,{className:`px-6 py-4 border-b border-[#1E293B]/40 bg-slate-900/10 flex flex-col md:flex-row gap-4 items-center`,children:[(0,b.jsxs)(`div`,{className:`relative w-full md:w-80`,children:[(0,b.jsx)(l,{size:15,className:`absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500`}),(0,b.jsx)(`input`,{type:`text`,placeholder:`Search saved answers...`,value:x,onChange:e=>S(e.target.value),className:`w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors`})]}),(0,b.jsxs)(`div`,{className:`flex items-center gap-2 w-full md:w-auto`,children:[(0,b.jsx)(c,{size:14,className:`text-slate-500`}),(0,b.jsx)(`select`,{value:C,onChange:e=>w(e.target.value),className:`bg-slate-950/40 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer`,children:T.map(e=>(0,b.jsx)(`option`,{value:e,className:`bg-slate-900 text-slate-200`,children:e},e))})]})]}),(0,b.jsx)(`div`,{className:`flex-1 overflow-auto p-6`,children:n?(0,b.jsx)(`div`,{className:`h-48 flex items-center justify-center`,children:(0,b.jsx)(`span`,{className:`w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin`})}):M.length===0?(0,b.jsxs)(`div`,{className:`h-64 glass rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3`,children:[(0,b.jsx)(r,{size:40,className:`text-slate-600`}),(0,b.jsx)(`h3`,{className:`text-slate-300 font-semibold text-sm`,children:`No saved answers`}),(0,b.jsx)(`p`,{className:`text-slate-500 text-xs max-w-sm`,children:`Answers bookmarked during chat study sessions will appear here.`})]}):(0,b.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`,children:M.map(e=>{let t=new Date(e.created_at).toLocaleDateString();return(0,b.jsxs)(`div`,{onClick:()=>O(e),className:`glass hover:bg-slate-800/30 border border-slate-800/80 hover:border-emerald-500/20 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between h-48 group relative`,children:[(0,b.jsxs)(`div`,{className:`space-y-2.5 overflow-hidden`,children:[(0,b.jsxs)(`div`,{className:`flex items-center justify-between gap-2`,children:[(0,b.jsx)(`span`,{className:`px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-400 font-semibold uppercase tracking-wider text-[9px]`,children:e.subject}),(0,b.jsx)(`span`,{className:`text-[10px] text-slate-500`,children:t})]}),(0,b.jsx)(`h3`,{className:`font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2`,children:e.title}),(0,b.jsx)(`p`,{className:`text-xs text-slate-400 line-clamp-3 leading-relaxed`,children:e.content.replace(/[#*`]/g,``)})]}),(0,b.jsxs)(`div`,{className:`flex items-center justify-between border-t border-slate-800/60 pt-3 mt-3 text-slate-500 text-[10px]`,children:[(0,b.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,b.jsx)(v,{size:10}),e.tags||`normal`]}),(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`button`,{onClick:t=>A(e.id,t),className:`p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer`,title:`Delete`,children:(0,b.jsx)(i,{size:12})}),(0,b.jsx)(`button`,{className:`p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer`,title:`Open Details`,children:(0,b.jsx)(s,{size:12})})]})]})]},e.id)})})}),(0,b.jsx)(d,{isOpen:!!D,onClose:()=>O(null),title:D?.title||`Saved Answer`,size:`lg`,children:D&&(0,b.jsxs)(`div`,{className:`space-y-6`,children:[(0,b.jsxs)(`div`,{className:`flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs`,children:[(0,b.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,b.jsx)(`span`,{className:`px-2 py-0.5 rounded bg-slate-850 border border-slate-700/80 text-slate-400 font-semibold uppercase tracking-wider`,children:D.subject}),(0,b.jsx)(`span`,{className:`text-slate-500`,children:`|`}),(0,b.jsxs)(`span`,{className:`text-slate-400 font-medium uppercase`,children:[`Mode: `,D.tags||`normal`]})]}),(0,b.jsx)(g,{variant:`secondary`,size:`sm`,onClick:j,icon:(0,b.jsx)(_,{size:14}),className:`py-1.5 px-3 rounded-lg`,children:`Export as PDF`})]}),(0,b.jsx)(`div`,{id:`pdf-print-area`,className:`markdown-container text-slate-200 text-sm leading-relaxed overflow-y-auto max-h-[50vh] p-2`,children:(0,b.jsx)(f,{remarkPlugins:[p],children:D.content})})]})})]})}export{x as default};