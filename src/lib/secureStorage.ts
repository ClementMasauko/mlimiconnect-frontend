import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const allowedKeys=new Set(["device_credential","push_registration_id"]);
export async function setNativeCredential(key:string,value:string){if(!Capacitor.isNativePlatform())throw new Error("Native secure storage is unavailable on the web.");if(!allowedKeys.has(key))throw new Error("Credential key is not allowlisted.");await SecureStorage.set(key,value);}
export async function getNativeCredential(key:string){if(!Capacitor.isNativePlatform()||!allowedKeys.has(key))return null;return await SecureStorage.get(key) as string|null;}
export async function removeNativeCredential(key:string){if(Capacitor.isNativePlatform()&&allowedKeys.has(key))await SecureStorage.remove(key);}
