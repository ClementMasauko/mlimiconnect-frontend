import * as Sentry from "@sentry/react";
import { Capacitor } from "@capacitor/core";
import { init as initCapacitorSentry } from "@sentry/capacitor";

const dsn=import.meta.env.VITE_SENTRY_DSN as string|undefined;
const release=import.meta.env.VITE_APP_VERSION||"development";
const email=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phone=/(?<!\w)(?:\+?265|0)?(?:8[0-9]|9[0-9])(?:[\s-]*\d){7}(?!\w)/g;
const secret=/(bearer\s+|api[_-]?key[=: ]+|token[=: ]+|password[=: ]+)[^\s,;]+/gi;
const sensitive=new Set(["authorization","cookie","password","pin","token","api_key","secret","phone","email","message","body","data"]);

export function redactMonitoringText(value:string){return value.replace(email,"[REDACTED_EMAIL]").replace(phone,"[REDACTED_PHONE]").replace(secret,"[REDACTED_SECRET]").slice(0,4000)}
export function scrubMonitoringValue(value:unknown,key=""):unknown{if(sensitive.has(key.toLowerCase().replaceAll("-","_")))return"[REDACTED]";if(typeof value==="string")return redactMonitoringText(value);if(Array.isArray(value))return value.slice(0,50).map(item=>scrubMonitoringValue(item));if(value&&typeof value==="object")return Object.fromEntries(Object.entries(value).slice(0,50).map(([name,item])=>[name,scrubMonitoringValue(item,name)]));return value}
function safeUrl(value?:string){if(!value)return value;try{const url=new URL(value,window.location.origin);return `${url.origin}${url.pathname}`;}catch{return value.split(/[?#]/)[0]}}

export function initializeMonitoring(){
  if(!dsn)return false;
  const tracesSampleRate=Math.max(0,Math.min(Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE||0),1));
  const options={dsn,release,environment:import.meta.env.MODE,sendDefaultPii:false,tracesSampleRate,maxBreadcrumbs:30,attachStacktrace:true,
    beforeBreadcrumb(breadcrumb:Sentry.Breadcrumb){if(breadcrumb.category==="navigation"&&breadcrumb.data){breadcrumb.data={from:safeUrl(String(breadcrumb.data.from||"")),to:safeUrl(String(breadcrumb.data.to||""))};}else breadcrumb.data=undefined;if(breadcrumb.message)breadcrumb.message=redactMonitoringText(breadcrumb.message);return breadcrumb;},
    beforeSend(event:Sentry.ErrorEvent){delete event.user;delete event.request;event.extra=scrubMonitoringValue(event.extra) as Sentry.ErrorEvent["extra"];event.contexts=scrubMonitoringValue(event.contexts) as Sentry.ErrorEvent["contexts"];event.breadcrumbs=event.breadcrumbs?.slice(-30).map(item=>({...item,message:item.message?redactMonitoringText(item.message):item.message,data:undefined}));event.exception?.values?.forEach(value=>{if(value.value)value.value=redactMonitoringText(value.value);});return event;}};
  if(Capacitor.isNativePlatform())initCapacitorSentry(options,Sentry.init);else Sentry.init(options);
  return true;
}

export function reportError(error:unknown,context?:Record<string,unknown>){if(!dsn)return;Sentry.withScope(scope=>{if(context)scope.setContext("safe_context",scrubMonitoringValue(context) as Record<string,unknown>);Sentry.captureException(error);});}
