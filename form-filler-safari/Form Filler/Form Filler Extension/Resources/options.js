const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new n(s,e,i)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,f=g?g.emptyScript:"",b=u.reactiveElementPolyfillSupport,m=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(s){i=null}}return i}},v=(e,t)=>!a(e,t),y={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),u.litPropertyMetadata??(u.litPropertyMetadata=new WeakMap);let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:n}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);n?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const e=this.properties,t=[...c(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const e=this._$Eu(t,i);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(t)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=s;const o=n.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const s=this.constructor,n=this[e];if(i??(i=s.getPropertyOptions(e)),!((i.hasChanged??v)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==n||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[m("elementProperties")]=new Map,$[m("finalized")]=new Map,b?.({ReactiveElement:$}),(u.reactiveElementVersions??(u.reactiveElementVersions=[])).push("2.1.1");const w=globalThis,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,_="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,E=`<${C}>`,T=document,F=()=>T.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,O="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,I=/>/g,N=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,R=/"/g,H=/^(?:script|style|textarea|title)$/i,j=(e,...t)=>({_$litType$:1,strings:e,values:t}),L=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,q=T.createTreeWalker(T,129);function B(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}class G{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0;const r=e.length-1,a=this.parts,[l,d]=((e,t)=>{const i=e.length-1,s=[];let n,o=2===t?"<svg>":3===t?"<math>":"",r=D;for(let a=0;a<i;a++){const t=e[a];let i,l,d=-1,c=0;for(;c<t.length&&(r.lastIndex=c,l=r.exec(t),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=z:void 0!==l[1]?r=I:void 0!==l[2]?(H.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=N):void 0!==l[3]&&(r=N):r===N?">"===l[0]?(r=n??D,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,i=l[1],r=void 0===l[3]?N:'"'===l[3]?R:U):r===R||r===U?r=N:r===z||r===I?r=D:(r=N,n=void 0);const h=r===N&&e[a+1].startsWith("/>")?" ":"";o+=r===D?t+E:d>=0?(s.push(i),t.slice(0,d)+_+t.slice(d)+S+h):t+S+(-2===d?a:h)}return[B(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]})(e,t);if(this.el=G.createElement(l,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=q.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(_)){const t=d[o++],i=s.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?Y:"?"===r[1]?X:"@"===r[1]?ee:K}),s.removeAttribute(e)}else e.startsWith(S)&&(a.push({type:6,index:n}),s.removeAttribute(e));if(H.test(s.tagName)){const e=s.textContent.split(S),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],F()),q.nextNode(),a.push({type:2,index:++n});s.append(e[t],F())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(S,e+1));)a.push({type:7,index:n}),e+=S.length-1}n++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,s){if(t===L)return t;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=P(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(e),n._$AT(e,i,s)),void 0!==s?(i._$Co??(i._$Co=[]))[s]=n:i._$Cl=n),void 0!==n&&(t=J(e,n._$AS(e,t.values),n,s)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??T).importNode(t,!0);q.currentNode=s;let n=q.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new Q(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new te(n,this,e)),this._$AV.push(t),a=i[++r]}o!==a?.index&&(n=q.nextNode(),o++)}return q.currentNode=T,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),P(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==L&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(B(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Z(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new G(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new Q(this.O(F()),this.O(F()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class K{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(e,t=this,i,s){const n=this.strings;let o=!1;if(void 0===n)e=J(this,e,t,0),o=!P(e)||e!==this._$AH&&e!==L,o&&(this._$AH=e);else{const s=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=J(this,s[i+r],t,r),a===L&&(a=this._$AH[r]),o||(o=!P(a)||a!==this._$AH[r]),a===V?e=V:e!==V&&(e+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Y extends K{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class X extends K{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ee extends K{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===L)return;const i=this._$AH,s=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class te{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ie=w.litHtmlPolyfillSupport;ie?.(G,Q),(w.litHtmlVersions??(w.litHtmlVersions=[])).push("3.3.1");const se=globalThis;class ne extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let n=s._$litPart$;if(void 0===n){const e=i?.renderBefore??null;s._$litPart$=n=new Q(t.insertBefore(F(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}ne._$litElement$=!0,ne.finalized=!0,se.litElementHydrateSupport?.({LitElement:ne});const oe=se.litElementPolyfillSupport;oe?.({LitElement:ne}),(se.litElementVersions??(se.litElementVersions=[])).push("4.2.1");const re=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ae={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:v},le=(e=ae,t,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,n,e)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];t.call(this,i),this.requestUpdate(s,n,e)}}throw Error("Unsupported decorator location: "+s)};function de(e){return(t,i)=>"object"==typeof i?le(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ce(e){return de({...e,state:!0,attribute:!1})}const he=new class{constructor(){this.config={level:2,prefix:"[Form Filler]",enableInProduction:!1,enableTimestamp:!0}}shouldLog(e){return this.config.enableInProduction?e>=this.config.level:e>=3}formatMessage(e,t,...i){return[`${this.config.enableTimestamp?`[${(new Date).toISOString()}]`:""} ${this.config.prefix} ${e}:`,t,...i]}debug(e,...t){this.shouldLog(0)}info(e,...t){this.shouldLog(1)}warn(e,...t){this.shouldLog(2)}error(e,t,...i){this.shouldLog(3)&&Error}report(e,t){}group(e,t=!1){this.shouldLog(0)}groupEnd(){this.shouldLog(0)}configure(e){this.config={...this.config,...e}}};function pe(e,t=1e3){if(e.length>t)return he.warn("Security: Regex pattern too long",{length:e.length}),!1;const i=[/(\w+)+$/,/(\d+)*$/,/(a+)+$/,/(\w*)*$/];for(const s of i)if(s.test(e))return he.warn("Security: Potentially vulnerable regex pattern detected"),!1;try{return!0}catch{return he.warn("Security: Invalid regex pattern"),!1}}he.debug.bind(he),he.info.bind(he),he.warn.bind(he),he.error.bind(he),he.report.bind(he),he.group.bind(he),he.groupEnd.bind(he);var ue=Object.defineProperty,ge=Object.getOwnPropertyDescriptor,fe=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?ge(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&ue(t,i,o),o};let be=class extends ne{constructor(){super(...arguments),this.settings={}}handleLocaleChange(e){const t=e.target;this.dispatchChange({locale:t.value})}handleCheckboxChange(e,t){const i=t.target;this.dispatchChange({[e]:i.checked})}handleThresholdChange(e){const t=e.target;this.dispatchChange({aiConfidenceThreshold:parseInt(t.value,10)})}dispatchChange(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:e,bubbles:!0,composed:!0}))}openShortcuts(){"undefined"!=typeof browser||navigator.userAgent.includes("Firefox")?("undefined"!=typeof browser?browser:chrome).tabs.create({url:"about:addons"}).then(()=>{}).catch(()=>{alert('To customize shortcuts in Firefox:\n1. Type "about:addons" in address bar\n2. Click gear icon (⚙️)\n3. Select "Manage Extension Shortcuts"')}):chrome.tabs.create({url:"chrome://extensions/shortcuts"})}render(){const e=this.settings.aiConfidenceThreshold||60;return j`
      <fieldset>
        <legend>Language & Locale</legend>
        <label>
          Language:
          <select @change=${this.handleLocaleChange} .value=${this.settings.locale||"ja"}>
            <option value="en" ?selected=${"en"===this.settings.locale}>English</option>
            <option value="vi" ?selected=${"vi"===this.settings.locale}>Vietnamese</option>
            <option value="ja" ?selected=${"ja"===this.settings.locale}>Japanese</option>
            <option value="zh" ?selected=${"zh"===this.settings.locale}>Chinese</option>
            <option value="ar" ?selected=${"ar"===this.settings.locale}>Arabic</option>
            <option value="fr" ?selected=${"fr"===this.settings.locale}>French</option>
            <option value="de" ?selected=${"de"===this.settings.locale}>German</option>
            <option value="ko" ?selected=${"ko"===this.settings.locale}>Korean</option>
            <option value="pl" ?selected=${"pl"===this.settings.locale}>Polish</option>
            <option value="ru" ?selected=${"ru"===this.settings.locale}>Russian</option>
            <option value="es" ?selected=${"es"===this.settings.locale}>Spanish</option>
          </select>
          <i class="help-text">Language used for generated fake data.</i>
        </label>
      </fieldset>

      <fieldset>
        <legend>Keyboard Shortcuts</legend>
        <div class="note">
          <b>Default Shortcuts:</b>
          <ul>
            <li>
              <code>Cmd+Shift+F</code> (Mac) / <code>Ctrl+Shift+F</code> (Windows) - Fill form
            </li>
            <li>
              <code>Cmd+Shift+Z</code> (Mac) / <code>Ctrl+Shift+Z</code> (Windows) - Undo fill
            </li>
            <li>
              <code>Cmd+Shift+X</code> (Mac) / <code>Ctrl+Shift+X</code> (Windows) - Clear form
            </li>
          </ul>
          <button class="add-btn" @click=${this.openShortcuts}>Customize Keyboard Shortcuts</button>
          <div class="help-section">
            Click the button above to open your browser's keyboard shortcuts page where you can
            customize all shortcuts for this extension.
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Visual Feedback</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.enableSound}
            @change=${e=>this.handleCheckboxChange("enableSound",e)}
          />
          Play sound when form is filled
        </label>
        <div class="note">
          When enabled, a subtle beep sound will play after successfully filling the form.
        </div>

        <label style="margin-top: 16px;">
          <input
            type="checkbox"
            ?checked=${!1!==this.settings.enableAIDetection}
            @change=${e=>this.handleCheckboxChange("enableAIDetection",e)}
          />
          Enable AI-Powered Field Detection
        </label>
        <div class="note blue-bg">
          <strong>Smart Detection:</strong> Uses machine learning-inspired algorithms to
          intelligently detect field types when standard rules don't match.
          <br />
          Features:
          <br />
          - Analyzes field names, labels, placeholders, and context
          <br />
          - Learns from real-world form patterns
          <br />
          - Provides confidence scores for predictions
          <br />
          - Works as a fallback when rule-based detection returns generic "text"
          <br />
          <br />
          <label class="slider-label">
            Confidence Threshold: <span class="slider-value">${e}%</span>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              .value=${e.toString()}
              @input=${this.handleThresholdChange}
            />
          </label>
          <i class="help-text">
            Higher threshold = more accurate but may skip uncertain fields. Lower threshold = fills
            more fields but with less certainty.
          </i>
        </div>
      </fieldset>
    `}};be.styles=o`
    fieldset {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin: 28px 36px 0 36px;
      padding: 18px 24px;
      background: #f9f9f9;
    }

    legend {
      color: #2d7ff9;
      font-size: 1.15em;
      font-weight: bold;
      padding: 0 8px;
    }

    label {
      display: block;
      font-size: 1.05em;
      margin-bottom: 8px;
    }

    select,
    input[type='range'] {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em;
      transition: border 0.2s;
    }

    select:focus,
    input:focus {
      border: 1.5px solid #2d7ff9;
      outline: none;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin-right: 8px;
      vertical-align: middle;
    }

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .note.blue-bg {
      background: #f0f9ff;
      border-left-color: #3b82f6;
    }

    .note strong {
      color: #2d7ff9;
    }

    .note ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }

    .note code {
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.92em;
    }

    .slider-label {
      margin-top: 8px;
      display: block;
    }

    .slider-value {
      font-weight: 600;
      color: #2d7ff9;
    }

    input[type='range'] {
      width: 200px;
      margin-left: 8px;
    }

    .help-text {
      font-size: small;
      color: #888;
      display: block;
      margin-top: 6px;
    }

    .add-btn {
      background: #2d7ff9;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      transition: background 0.2s;
      display: inline-block;
      margin-top: 12px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .help-section {
      font-size: 0.92em;
      color: #666;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `,fe([de({type:Object})],be.prototype,"settings",2),be=fe([re("general-tab")],be);var me=Object.defineProperty,xe=Object.getOwnPropertyDescriptor,ve=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?xe(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&me(t,i,o),o};let ye=class extends ne{constructor(){super(...arguments),this.settings={}}handleTextChange(e,t){const i=t.target;this.dispatchChange({[e]:i.value})}handleCheckboxChange(e,t){const i=t.target;this.dispatchChange({[e]:i.checked})}handleNumberChange(e,t){const i=t.target,s=i.value?parseInt(i.value,10):void 0;this.dispatchChange({[e]:s})}dispatchChange(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:e,bubbles:!0,composed:!0}))}render(){return j`
      <fieldset>
        <legend>Field Filtering</legend>
        <label>
          Ignore fields with these keywords (comma-separated):
          <input
            type="text"
            .value=${this.settings.ignoreFields||""}
            @input=${e=>this.handleTextChange("ignoreFields",e)}
            placeholder="e.g. password,confirm,captcha"
          />
          <i class="help-text">Fields containing these keywords will be skipped.</i>
        </label>
        <label style="margin-top: 16px;">
          <input
            type="checkbox"
            ?checked=${!1!==this.settings.ignoreHidden}
            @change=${e=>this.handleCheckboxChange("ignoreHidden",e)}
          />
          Ignore hidden or invisible fields
        </label>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.ignoreFilled}
            @change=${e=>this.handleCheckboxChange("ignoreFilled",e)}
          />
          Ignore fields with existing content
        </label>
        <div class="note">
          <b>Note:</b> Fields with type="hidden" or readonly are always ignored.
          <br />
          Use keywords to skip sensitive fields like passwords.
        </div>
      </fieldset>

      <fieldset>
        <legend>Domain Filtering</legend>
        <label>
          Domains to ignore (one per line):
          <textarea
            rows="5"
            .value=${this.settings.ignoreDomains||""}
            @input=${e=>this.handleTextChange("ignoreDomains",e)}
            placeholder="e.g.&#10;example.com&#10;test.site.com"
          ></textarea>
          <i class="help-text">The extension won't fill forms on these websites.</i>
        </label>
      </fieldset>

      <fieldset>
        <legend>Label-Based Matching</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${!1!==this.settings.enableLabelMatching}
            @change=${e=>this.handleCheckboxChange("enableLabelMatching",e)}
          />
          Enable label-based field matching
        </label>
        <div class="note">
          When enabled, the extension will find the closest label to input fields and use it for
          matching custom fields.
          <br />
          This helps when fields don't have clear name, id, class, or other attributes.
          <br />
          <br />
          <b>How it works:</b>
          <br />
          - Finds the closest label element near the input
          <br />
          - Considers distance and text content to determine the best match
          <br />
          - Works with standard &lt;label&gt; elements and other label-like elements
          <br />
          - Enhances custom field matching patterns to include label text
        </div>
      </fieldset>

      <fieldset>
        <legend>Default Password</legend>
        <label>
          Default password for all password fields:
          <input
            type="text"
            .value=${this.settings.defaultPassword||""}
            @input=${e=>this.handleTextChange("defaultPassword",e)}
            placeholder="Leave empty to use random passwords"
          />
          <i class="help-text">
            If set, all password fields will use this value instead of random passwords.
            <br />
            Perfect for testing - use the same password (e.g., "123456") for all accounts.
          </i>
        </label>
        <div class="note">
          <b>Pro Tip:</b> Many testers prefer a consistent password like <code>Test@123</code> or
          <code>Password1!</code>
          <br />
          This makes it easy to remember and log back into test accounts.
          <br />
          <br />
          <b>Security Note:</b> Only use this feature for testing/development environments!
        </div>
      </fieldset>

      <fieldset>
        <legend>Birthdate / Age Range</legend>
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
          <label style="flex: 1; min-width: 120px;">
            Minimum Age:
            <input
              type="number"
              min="0"
              max="120"
              .value=${void 0!==this.settings.minAge?String(this.settings.minAge):"18"}
              @input=${e=>this.handleNumberChange("minAge",e)}
              style="width: 80px;"
            />
          </label>
          <label style="flex: 1; min-width: 120px;">
            Maximum Age:
            <input
              type="number"
              min="0"
              max="120"
              .value=${void 0!==this.settings.maxAge?String(this.settings.maxAge):"65"}
              @input=${e=>this.handleNumberChange("maxAge",e)}
              style="width: 80px;"
            />
          </label>
        </div>
        <i class="help-text">
          Set the age range for generated birthdates. Defaults to 18-65 years old.
        </i>
        <div class="note">
          <b>How it works:</b> When filling date fields detected as birthdate/DOB fields, the
          extension will generate dates within this age range.
          <br />
          <b>Example:</b> Min Age = 21, Max Age = 35 → Birthdates from
          ${(new Date).getFullYear()-35} to ${(new Date).getFullYear()-21}
        </div>
      </fieldset>

      <fieldset>
        <legend>File Input Support</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${!1!==this.settings.enableFileInput}
            @change=${e=>this.handleCheckboxChange("enableFileInput",e)}
          />
          Enable file input auto-fill (experimental)
        </label>
        <i class="help-text">
          When enabled, file upload fields will be filled with a small placeholder file.
        </i>
        <div class="note">
          <b>Note:</b> This feature creates small test files (1x1 pixel images or text files) for
          testing file upload functionality.
          <br />
          <b>Supported types:</b> Images (PNG, JPEG, GIF), Documents (PDF, TXT)
          <br />
          <br />
          <b>⚠️ Experimental:</b> Some websites may not accept programmatically generated files.
        </div>
      </fieldset>

      <fieldset>
        <legend>Iframe Settings</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.disableIframeFill}
            @change=${e=>this.handleCheckboxChange("disableIframeFill",e)}
          />
          Disable form filling in iframes
        </label>
        <i class="help-text">
          When enabled, the extension will skip filling fields inside iframes.
        </i>
        <div class="note">
          <b>When to use:</b> Some websites embed forms in iframes (e.g., payment forms, embedded
          widgets). Enable this option if you want to skip filling fields in those embedded frames.
          <br />
          <br />
          <b>Note:</b> Cross-origin iframes are always skipped due to browser security restrictions.
        </div>
      </fieldset>
    `}};ye.styles=o`
    fieldset {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin: 28px 36px 0 36px;
      padding: 18px 24px;
      background: #f9f9f9;
    }

    legend {
      color: #2d7ff9;
      font-size: 1.15em;
      font-weight: bold;
      padding: 0 8px;
    }

    label {
      display: block;
      font-size: 1.05em;
      margin-bottom: 8px;
    }

    input[type='text'],
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em;
      transition: border 0.2s;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    input:focus,
    textarea:focus {
      border: 1.5px solid #2d7ff9;
      outline: none;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin-right: 8px;
      vertical-align: middle;
    }

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .help-text {
      font-size: small;
      color: #888;
      display: block;
      margin-top: 6px;
    }

    code {
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.92em;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `,ve([de({type:Object})],ye.prototype,"settings",2),ye=ve([re("behavior-tab")],ye);var $e=Object.defineProperty,we=Object.getOwnPropertyDescriptor,ke=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?we(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&$e(t,i,o),o};const Ae=["person.firstName","person.lastName","person.fullName","person.jobTitle","location.zipCode","location.city","location.streetAddress","location.country","phone.number","internet.email","internet.userName","internet.url","internet.domainName","company.name","company.catchPhrase","lorem.word","lorem.sentence","lorem.paragraph","date.past","date.future","date.birthdate","finance.amount","finance.currencyName","finance.creditCardNumber","word.words","color.human"];let _e=class extends ne{constructor(){super(...arguments),this.fields=[]}addField(){const e=[...this.fields,{field:"",type:"list",value:""}];this.emitChange(e)}removeField(e){const t=this.fields.filter((t,i)=>i!==e);this.emitChange(t)}updateField(e,t){const i=[...this.fields],s=i[e];s&&(i[e]={...s,...t},this.emitChange(i))}emitChange(e){this.dispatchEvent(new CustomEvent("fields-change",{detail:{fields:e},bubbles:!0,composed:!0}))}render(){return 0===this.fields.length?j`
        <div class="empty-state">
          <p>No custom fields defined yet.</p>
          <p>Click "Add New Rule" below to create your first custom field rule.</p>
        </div>
        <button class="add-btn" @click=${this.addField}>Add New Rule</button>
      `:j`
      <table class="custom-fields-table">
        <thead>
          <tr>
            <th style="text-align: left;">Matching Field</th>
            <th style="text-align: left;">Type</th>
            <th style="text-align: left;">Value / Faker Data Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.fields.map((e,t)=>j`
              <tr>
                <td>
                  <input
                    type="text"
                    .value=${e.field}
                    @input=${e=>this.updateField(t,{field:e.target.value})}
                    placeholder="e.g., *address*, #email"
                  />
                </td>
                <td>
                  <select
                    .value=${e.type}
                    @change=${e=>this.updateField(t,{type:e.target.value})}
                  >
                    <option value="list" ?selected=${"list"===e.type}>List</option>
                    <option value="regex" ?selected=${"regex"===e.type}>Regex</option>
                    <option value="faker" ?selected=${"faker"===e.type}>Faker</option>
                  </select>
                </td>
                <td>
                  ${"faker"===e.type?j`
                        <select
                          class="field-faker"
                          .value=${e.faker||"internet.email"}
                          @change=${e=>this.updateField(t,{faker:e.target.value})}
                        >
                          ${Ae.map(t=>j`
                              <option value="${t}" ?selected=${e.faker===t}>
                                ${t}
                              </option>
                            `)}
                        </select>
                      `:j`
                        <input
                          type="text"
                          class="field-value"
                          .value=${e.value||""}
                          @input=${e=>this.updateField(t,{value:e.target.value})}
                          placeholder="Value or Pattern"
                        />
                      `}
                </td>
                <td>
                  <button class="remove-btn" @click=${()=>this.removeField(t)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            `)}
        </tbody>
      </table>
      <button class="add-btn" @click=${this.addField}>Add New Rule</button>
    `}};_e.styles=o`
    .custom-fields-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 10px;
      background: #f8fbff;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(45, 127, 249, 0.07);
      overflow: hidden;
    }

    .custom-fields-table th,
    .custom-fields-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e7ef;
      font-size: 1em;
    }

    .custom-fields-table th {
      background: #eaf2ff;
      color: #2d7ff9;
      font-weight: 600;
      text-align: left;
    }

    .custom-fields-table tr:last-child td {
      border-bottom: none;
    }

    .custom-fields-table select,
    .custom-fields-table input[type="text"] {
      width: 100%;
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid #c3d3ee;
      font-size: 1em;
      background: #fff;
      transition: border 0.2s;
      box-sizing: border-box;
    }

    .custom-fields-table select:focus,
    .custom-fields-table input[type="text"]:focus {
      border: 1.5px solid #2d7ff9;
      outline: none;
    }

    .remove-btn {
      background: #e74c3c;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.98em;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: #c0392b;
    }

    .remove-btn svg {
      width: 16px;
      height: 16px;
    }

    .add-btn {
      background: #2d7ff9;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      transition: background 0.2s;
      margin-top: 12px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .field-faker-container {
      display: block;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #888;
      font-size: 0.95em;
    }
  `,ke([de({type:Array})],_e.prototype,"fields",2),_e=ke([re("custom-fields-table")],_e);var Se=Object.defineProperty,Ce=Object.getOwnPropertyDescriptor,Ee=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?Ce(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&Se(t,i,o),o};let Te=class extends ne{constructor(){super(...arguments),this.settings={},this.quickGuideVisible=!0}connectedCallback(){super.connectedCallback();const e=localStorage.getItem("quickGuideVisible");this.quickGuideVisible="false"!==e}toggleQuickGuide(){this.quickGuideVisible=!this.quickGuideVisible,localStorage.setItem("quickGuideVisible",this.quickGuideVisible.toString())}handleFieldsChange(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:{customFields:e.detail.fields},bubbles:!0,composed:!0}))}render(){return j`
      <fieldset>
        <legend>Custom Filling Rules</legend>
        <p class="note">
          Define your own rules to fill specific fields. The extension will try to match these rules
          first before using its standard detection.
        </p>

        <button class="add-btn" @click=${this.toggleQuickGuide}>
          ${this.quickGuideVisible?"Hide Quick Guide":"Show Quick Guide"}
        </button>

        ${this.quickGuideVisible?j`
              <div class="note warning">
                <strong>Quick Guide:</strong><br /><br />

                <strong>1. Matching Field - How to target fields:</strong><br />
                <ul>
                  <li>
                    <strong>Wildcard patterns:</strong>
                    <ul style="margin: 4px 0 0 20px;">
                      <li><code>*email*</code> - Matches any field containing "email"</li>
                      <li><code>phone*</code> - Matches fields starting with "phone"</li>
                      <li><code>*address</code> - Matches fields ending with "address"</li>
                    </ul>
                  </li>
                  <li>
                    <strong>CSS selectors:</strong>
                    <ul style="margin: 4px 0 0 20px;">
                      <li><code>#username</code> - Match by ID</li>
                      <li><code>.email-field</code> - Match by class name</li>
                      <li><code>[data-field="email"]</code> - Match by attribute</li>
                    </ul>
                  </li>
                </ul>

                <strong>2. Type - Choose how to generate data:</strong><br /><br />

                <div style="margin-left: 20px;">
                  <strong>List Type</strong> - Random selection from your values<br />
                  <div class="example-box">
                    <strong>Example:</strong> City selector
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*city*</code></li>
                      <li>Type: <code>List</code></li>
                      <li>Value: <code>Hanoi,Ho Chi Minh,Da Nang</code></li>
                    </ul>
                  </div>

                  <strong>Regex Type</strong> - Pattern-based generation<br />
                  <div class="example-box">
                    <strong>Example:</strong> Employee ID
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*employeeid*</code></li>
                      <li>Type: <code>Regex</code></li>
                      <li>Value: <code>EMP[0-9]{6}</code></li>
                      <li>Result: <code>EMP123456</code></li>
                    </ul>
                  </div>

                  <strong>Faker Type</strong> - Realistic fake data<br />
                  <div class="example-box">
                    <strong>Example:</strong> Email field
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*email*</code></li>
                      <li>Type: <code>Faker</code></li>
                      <li>Faker Data Type: <code>internet.email</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            `:""}

        <custom-fields-table
          .fields=${this.settings.customFields||[]}
          @fields-change=${this.handleFieldsChange}
        ></custom-fields-table>

        <div class="note" style="margin-top: 20px;">
          <strong>Pro Tips:</strong>
          <ul style="margin-top: 8px;">
            <li><strong>Priority matters:</strong> Rules are checked from top to bottom</li>
            <li><strong>Test before use:</strong> Start with simple forms first</li>
            <li><strong>Wildcard power:</strong> Use <code>*keyword*</code> to match anywhere</li>
            <li><strong>Backup settings:</strong> Export your rules regularly</li>
          </ul>
        </div>
      </fieldset>
    `}};Te.styles=o`
    fieldset {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin: 28px 36px 0 36px;
      padding: 18px 24px;
      background: #f9f9f9;
    }

    legend {
      color: #2d7ff9;
      font-size: 1.15em;
      font-weight: bold;
      padding: 0 8px;
    }

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .note.warning {
      background: #fff3cd;
      border-left-color: #ffc107;
    }

    .note ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }

    .note code {
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.92em;
    }

    .add-btn {
      background: #2d7ff9;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      transition: background 0.2s;
      margin-bottom: 16px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .example-box {
      margin: 8px 0 12px 20px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `,Ee([de({type:Object})],Te.prototype,"settings",2),Ee([ce()],Te.prototype,"quickGuideVisible",2),Te=Ee([re("custom-fields-tab")],Te);var Fe=Object.defineProperty,Pe=Object.getOwnPropertyDescriptor,Me=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?Pe(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&Fe(t,i,o),o};let Oe=class extends ne{constructor(){super(...arguments),this.settings={},this.version="",this.statusMessage=""}async exportSettings(){try{const e=await chrome.storage.local.get(null),t={_metadata:{version:chrome.runtime.getManifest().version,exportDate:(new Date).toISOString(),extensionName:"Form Filler"},...e},i="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t,null,2)),s=document.createElement("a");s.setAttribute("href",i);const n=(new Date).toISOString().split("T")[0];s.setAttribute("download",`form-filler-settings-${n}.json`),document.body.appendChild(s),s.click(),s.remove(),this.showStatus("✓ Settings exported successfully!","success")}catch(e){this.showStatus("✗ Failed to export settings","error"),he.error("Export error:",e)}}importSettings(){const e=this.shadowRoot?.querySelector('input[type="file"]');e&&e.click()}handleFileSelect(e){const t=e.target,i=t.files?.[0];if(!i)return;const s=new FileReader;s.onload=async e=>{try{const i=e.target?.result;if("string"!=typeof i)return;const s=JSON.parse(i),{_metadata:n,...o}=s,r=["locale","ignoreFields","ignoreHidden","ignoreFilled","ignoreDomains","enableLabelMatching","enableSound","enableAIDetection","aiConfidenceThreshold","customFields","defaultPassword","minAge","maxAge","enableFileInput","fileInputTypes"];if(!Object.keys(o).some(e=>r.includes(e)))return void this.showStatus("✗ Invalid settings file - no valid settings found","error");const a=n||{},l=a.version?`Import settings from version ${a.version}?\n${a.exportDate?`Exported: ${new Date(a.exportDate).toLocaleString()}`:""}\n\nThis will replace all current settings.`:"Import settings? This will replace all current settings.";if(!confirm(l))return void(t.value="");await chrome.storage.local.set(o),this.showStatus("✓ Settings imported successfully! Reloading...","success"),setTimeout(()=>{location.reload()},1e3)}catch{this.showStatus("✗ Invalid JSON file. Please check the file format.","error")}finally{t.value=""}},s.readAsText(i)}showStatus(e,t){this.statusMessage=e,setTimeout(()=>{this.statusMessage=""},"success"===t?3e3:5e3),this.requestUpdate()}render(){return j`
      <fieldset>
        <legend>Import / Export Settings</legend>
        <div class="button-container">
          <button class="export-btn" @click=${this.exportSettings}>Export Settings</button>
          <input type="file" accept="application/json" @change=${this.handleFileSelect} />
          <button class="import-btn" @click=${this.importSettings}>Import Settings</button>
        </div>
        ${this.statusMessage&&!this.statusMessage.includes("learned")?j`<div
              class="status-message ${this.statusMessage.includes("✓")?"success":"error"}"
            >
              ${this.statusMessage}
            </div>`:""}
        <div class="note">
          <b>Export:</b> Download all your settings as a JSON file for backup or sharing.<br />
          <ul>
            <li>Includes all settings: locale, behavior, custom fields, AI detection, etc.</li>
            <li>File name includes export date</li>
            <li>Contains metadata for tracking</li>
          </ul>
          <b>Import:</b> Restore settings from a previously exported JSON file.<br />
          <ul>
            <li>Shows confirmation dialog with file version</li>
            <li>Validates settings before importing</li>
            <li>Automatically reloads page after successful import</li>
          </ul>
          <b>Tip:</b> Export your settings regularly as backup, especially before making major
          changes.
        </div>
      </fieldset>

      <fieldset>
        <legend>Tips & Tricks</legend>
        <div class="tricks">
          <b>Quick Tips:</b><br />
          - Use keyboard shortcuts for faster workflow<br />
          - Right-click extension icon for quick actions<br />
          - Test custom fields on simple forms first<br />
          - Use wildcard patterns for flexible matching<br />
          - Enable label matching for better field detection<br />
          - Export settings regularly as backup
        </div>
      </fieldset>

      <fieldset>
        <legend>About</legend>
        <div class="about-section">
          <p><b>Version:</b> ${this.version}</p>
          <p><b>Author:</b> thuyydt</p>
          <p><b>Support:</b> <a href="mailto:thuydtshop@gmail.com">thuydtshop@gmail.com</a></p>
          <p>
            <i>"Filling forms faster than you can say 'terms and conditions accepted'"</i>
          </p>
        </div>
      </fieldset>
    `}};Oe.styles=o`
    fieldset {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin: 28px 36px 0 36px;
      padding: 18px 24px;
      background: #f9f9f9;
    }

    legend {
      color: #2d7ff9;
      font-size: 1.15em;
      font-weight: bold;
      padding: 0 8px;
    }

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .note ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }

    .tricks {
      padding: 12px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 0.96em;
      line-height: 1.8;
    }

    .button-container {
      text-align: center;
      margin: 16px 0;
    }

    .export-btn,
    .import-btn {
      background: #34495e;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 0.98em;
      margin: 0 6px;
      transition: background 0.2s;
    }

    .export-btn:hover,
    .import-btn:hover {
      background: #2c3e50;
    }

    .about-section {
      padding: 12px;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .about-section p {
      margin: 0 0 8px 0;
    }

    .about-section a {
      color: #2d7ff9;
      text-decoration: none;
    }

    .about-section a:hover {
      text-decoration: underline;
    }

    .status-message {
      margin-top: 12px;
      text-align: center;
      font-weight: 500;
      min-height: 24px;
    }

    .status-message.success {
      color: #10b981;
    }

    .status-message.error {
      color: #ef4444;
    }

    input[type='file'] {
      display: none;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `,Me([de({type:Object})],Oe.prototype,"settings",2),Me([de({type:String})],Oe.prototype,"version",2),Me([ce()],Oe.prototype,"statusMessage",2),Oe=Me([re("advanced-tab")],Oe);var De=Object.defineProperty,ze=Object.getOwnPropertyDescriptor,Ie=(e,t,i,s)=>{for(var n,o=s>1?void 0:s?ze(t,i):t,r=e.length-1;r>=0;r--)(n=e[r])&&(o=(s?n(t,i,o):n(o))||o);return s&&o&&De(t,i,o),o};let Ne=class extends ne{constructor(){super(...arguments),this.activeTab="general",this.settings={},this.statusMessage="",this.statusType="success",this.version="",this.validationErrors=[],this.validationWarnings=[]}connectedCallback(){super.connectedCallback(),this.loadVersion(),this.loadSettings(),this.restoreActiveTab()}loadVersion(){const e=chrome.runtime.getManifest();this.version=e.version}restoreActiveTab(){const e=localStorage.getItem("formFillerActiveTab");e&&(this.activeTab=e)}loadSettings(){chrome.storage.local.get(null,e=>{this.settings={locale:e.locale||"ja",ignoreFields:e.ignoreFields||"capcha,hipinputtext",ignoreHidden:!1!==e.ignoreHidden,ignoreFilled:!!e.ignoreFilled,ignoreDomains:e.ignoreDomains||"",enableLabelMatching:!1!==e.enableLabelMatching,enableSound:!!e.enableSound,enableAIDetection:!1!==e.enableAIDetection,aiConfidenceThreshold:e.aiConfidenceThreshold||60,customFields:e.customFields||[],defaultPassword:e.defaultPassword||"",minAge:e.minAge??18,maxAge:e.maxAge??65,enableFileInput:!1!==e.enableFileInput}})}switchTab(e){this.activeTab=e,localStorage.setItem("formFillerActiveTab",e)}handleSettingsChange(e){this.settings={...this.settings,...e.detail}}async saveSettings(){try{const e=function(e){const t={valid:!0,errors:[],warnings:[]};if(e.locale){const i=function(e){const t=["ja","en","zh","vi","ar","ko","es","fr","de","pl","ru"],i={valid:t.includes(e),errors:[],warnings:[]};return i.valid||i.errors.push(`Invalid locale: ${e}. Must be one of: ${t.join(", ")}`),i}(e.locale);t.errors.push(...i.errors),t.warnings.push(...i.warnings),t.valid=t.valid&&i.valid}if(e.ignoreFields){const i=function(e){const t={valid:!0,errors:[],warnings:[]};if(!e.trim())return t;const i=e.split(",").map(e=>e.trim());for(const s of i)s.length>500&&(t.errors.push(`Pattern too long: ${s.substring(0,50)}...`),t.valid=!1),(s.includes("<script>")||s.includes("javascript:"))&&(t.errors.push("Dangerous pattern detected"),t.valid=!1);return t}(e.ignoreFields);t.errors.push(...i.errors),t.warnings.push(...i.warnings),t.valid=t.valid&&i.valid}if(e.ignoreDomains){const i=function(e){const t={valid:!0,errors:[],warnings:[]};if(!e.trim())return t;const i=e.split(",").map(e=>e.trim());for(const s of i)/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/.test(s)||t.warnings.push(`Suspicious domain format: ${s}`),s.length>253&&(t.errors.push(`Domain too long: ${s}`),t.valid=!1);return t}(e.ignoreDomains);t.errors.push(...i.errors),t.warnings.push(...i.warnings),t.valid=t.valid&&i.valid}if(e.customFields&&Array.isArray(e.customFields)){const i=function(e){const t={valid:!0,errors:[],warnings:[]};if(!Array.isArray(e))return t.errors.push("Custom fields must be an array"),t.valid=!1,t;e.length>100&&t.warnings.push("Too many custom fields may impact performance");for(let i=0;i<e.length;i++){const s=e[i];s&&(s.field&&"string"==typeof s.field?(["list","regex","faker"].includes(s.type)||(t.errors.push(`Custom field ${i+1}: Invalid type "${s.type}"`),t.valid=!1),"regex"===s.type&&s.value&&(pe(s.value)||(t.errors.push(`Custom field ${i+1}: Unsafe regex pattern`),t.valid=!1)),"list"===s.type&&s.value&&s.value.split(",").length>1e3&&t.warnings.push(`Custom field ${i+1}: Very large list may impact performance`),"faker"===s.type&&s.faker&&(/^[a-zA-Z]+\.[a-zA-Z]+$/.test(s.faker)||t.warnings.push(`Custom field ${i+1}: Faker path should be in format "module.method"`))):(t.errors.push(`Custom field ${i+1}: Missing or invalid field pattern`),t.valid=!1))}return t}(e.customFields);t.errors.push(...i.errors),t.warnings.push(...i.warnings),t.valid=t.valid&&i.valid}if(void 0!==e.aiConfidenceThreshold){const i=function(e){const t={valid:!0,errors:[],warnings:[]};return"number"!=typeof e||isNaN(e)?(t.errors.push("Confidence threshold must be a number"),t.valid=!1,t):((e<30||e>95)&&(t.errors.push("Confidence threshold must be between 30 and 95"),t.valid=!1),e<50&&t.warnings.push("Low confidence threshold may cause incorrect field detection"),t)}(e.aiConfidenceThreshold);t.errors.push(...i.errors),t.warnings.push(...i.warnings),t.valid=t.valid&&i.valid}return t}(this.settings);if(this.validationErrors=e.errors,this.validationWarnings=e.warnings,!e.valid)return this.statusType="error",this.statusMessage=`❌ Validation failed. Please fix ${e.errors.length} error${e.errors.length>1?"s":""} below.`,void setTimeout(()=>{this.statusMessage="",this.validationErrors=[]},8e3);e.warnings.length>0&&(this.statusType="warning",this.statusMessage=`⚠️ Settings saved with ${e.warnings.length} warning${e.warnings.length>1?"s":""}.`);const t=function(e){const t={...e};return t.ignoreFields&&"string"==typeof t.ignoreFields&&(t.ignoreFields=t.ignoreFields.trim()),t.ignoreDomains&&"string"==typeof t.ignoreDomains&&(t.ignoreDomains=t.ignoreDomains.trim().toLowerCase()),t.customFields&&Array.isArray(t.customFields)&&(t.customFields=t.customFields.filter(e=>e&&e.field&&e.type).map(e=>{return{...e,field:(t=e.field,t.replace(/[<>'"]/g,"").trim())};var t})),void 0!==t.aiConfidenceThreshold&&"number"==typeof t.aiConfidenceThreshold&&(t.aiConfidenceThreshold=Math.max(30,Math.min(95,t.aiConfidenceThreshold))),t}(this.settings);await chrome.storage.local.set(t),this.settings={...this.settings,...t},0===e.warnings.length?(this.statusType="success",this.statusMessage="✅ Settings have been successfully saved!"):this.statusMessage+=" (Settings saved with warnings)",setTimeout(()=>{this.statusMessage="",this.validationWarnings=[]},5e3)}catch(e){this.statusType="error",this.statusMessage="❌ Failed to save settings. Please try again.",he.error("Failed to save settings:",e),setTimeout(()=>{this.statusMessage=""},5e3)}}render(){return j`
      <div class="container">
        <div class="header">
          <h1>Form Filler Settings</h1>
          <span class="version">Version ${this.version}</span>
          <p class="subtitle">Configure your preferences for form filling</p>
        </div>

        <div class="tabs-nav">
          <button
            class="tab-button ${"general"===this.activeTab?"active":""}"
            @click=${()=>this.switchTab("general")}
          >
            General
          </button>
          <button
            class="tab-button ${"behavior"===this.activeTab?"active":""}"
            @click=${()=>this.switchTab("behavior")}
          >
            Behavior
          </button>
          <button
            class="tab-button ${"custom-fields"===this.activeTab?"active":""}"
            @click=${()=>this.switchTab("custom-fields")}
          >
            Custom Fields
          </button>
          <button
            class="tab-button ${"advanced"===this.activeTab?"active":""}"
            @click=${()=>this.switchTab("advanced")}
          >
            Advanced
          </button>
        </div>

        <div class="tab-content ${"general"===this.activeTab?"active":""}">
          <general-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></general-tab>
        </div>

        <div class="tab-content ${"behavior"===this.activeTab?"active":""}">
          <behavior-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></behavior-tab>
        </div>

        <div class="tab-content ${"custom-fields"===this.activeTab?"active":""}">
          <custom-fields-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></custom-fields-tab>
        </div>

        <div class="tab-content ${"advanced"===this.activeTab?"active":""}">
          <advanced-tab
            .settings=${this.settings}
            .version=${this.version}
            @settings-change=${this.handleSettingsChange}
          ></advanced-tab>
        </div>

        <button class="save-btn" @click=${this.saveSettings}>Save All Settings</button>

        ${this.statusMessage?j`<div class="status ${this.statusType}">${this.statusMessage}</div>`:""}
        ${this.validationErrors.length>0||this.validationWarnings.length>0?j`
              <div class="validation-details">
                ${this.validationErrors.length>0?j`
                      <ul class="validation-list">
                        ${this.validationErrors.map(e=>j`<li class="validation-item error">❌ ${e}</li>`)}
                      </ul>
                    `:""}
                ${this.validationWarnings.length>0?j`
                      <ul class="validation-list">
                        ${this.validationWarnings.map(e=>j`<li class="validation-item warning">⚠️ ${e}</li>`)}
                      </ul>
                    `:""}
              </div>
            `:""}
      </div>
    `}};Ne.styles=o`
    :host {
      display: block;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
      background: #fff;
      padding: 0 0 32px 0;
      border-radius: 12px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      padding-top: 20px;
    }

    h1 {
      color: #2d7ff9;
      margin-bottom: 8px;
      font-size: 2em;
    }

    .version {
      display: block;
      color: #555;
      font-size: 0.95em;
      margin-bottom: 4px;
    }

    .subtitle {
      color: #888;
      font-size: 0.88em;
      margin: 0 36px 16px;
    }

    .tabs-nav {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 36px;
      margin-top: 20px;
      gap: 4px;
    }

    .tab-button {
      background: transparent;
      border: none;
      padding: 12px 24px;
      font-size: 1.05em;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      position: relative;
      top: 2px;
    }

    .tab-button:hover {
      color: #2d7ff9;
      background: #f8fbff;
    }

    .tab-button.active {
      color: #2d7ff9;
      border-bottom-color: #2d7ff9;
      font-weight: 600;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .save-btn {
      display: block;
      background: #27ae60;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 14px 32px;
      font-size: 1.1em;
      font-weight: 600;
      margin: 32px auto 0 auto;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(39, 174, 96, 0.2);
    }

    .save-btn:hover {
      background: #229954;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
      transform: translateY(-1px);
    }

    .status {
      margin-top: 18px;
      font-size: 1.05em;
      color: #27ae60;
      min-height: 24px;
      text-align: center;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      background: #f0fdf4;
    }

    .status.error {
      color: #ef4444;
      background: #fef2f2;
    }

    .status.warning {
      color: #f59e0b;
      background: #fffbeb;
    }

    .validation-details {
      max-width: 800px;
      margin: 12px auto 0 auto;
      padding: 0 36px;
    }

    .validation-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .validation-item {
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 6px;
      font-size: 0.95em;
      line-height: 1.5;
    }

    .validation-item.error {
      background: #fef2f2;
      color: #dc2626;
      border-left: 3px solid #ef4444;
    }

    .validation-item.warning {
      background: #fffbeb;
      color: #d97706;
      border-left: 3px solid #f59e0b;
    }

    @media (max-width: 768px) {
      .container {
        margin: 20px;
        border-radius: 8px;
      }

      .tabs-nav {
        padding: 0 20px;
        overflow-x: auto;
      }

      .tab-button {
        padding: 10px 16px;
        font-size: 0.95em;
      }
    }
  `,Ie([ce()],Ne.prototype,"activeTab",2),Ie([ce()],Ne.prototype,"settings",2),Ie([ce()],Ne.prototype,"statusMessage",2),Ie([ce()],Ne.prototype,"statusType",2),Ie([ce()],Ne.prototype,"version",2),Ie([ce()],Ne.prototype,"validationErrors",2),Ie([ce()],Ne.prototype,"validationWarnings",2),Ne=Ie([re("options-page")],Ne);
