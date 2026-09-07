import { Link } from "react-router-dom";
import Card from "../components/ui/Card";

export default function AccountDeletion() {
  return <main className="mx-auto max-w-3xl px-4 py-12">
    <h1 className="text-4xl font-black">Delete your MlimiConnect account</h1>
    <p className="mt-4 text-slate-600 dark:text-slate-300">You can start a protected deletion request from the app. MlimiConnect verifies your password and a one-time code before deactivating the account.</p>
    <Card className="mt-8 p-6">
      <ol className="list-decimal space-y-3 pl-5">
        <li>Sign in and open <strong>My account → Settings</strong>.</li>
        <li>Choose <strong>Delete account</strong>, confirm your password, and request the verification code.</li>
        <li>Enter the code sent to your registered contact and confirm deletion.</li>
      </ol>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">The account is immediately disabled. Some transaction, ledger, dispute, fraud-prevention, audit, or legal records may be retained where required; public profile and active listing access are removed. The final retention periods require legal approval before public launch.</p>
      <p className="mt-4 text-sm">If you cannot sign in, use the <Link className="font-bold text-green-700" to="/contact">contact form</Link> from the email or phone registered to the account. Support must verify identity before acting.</p>
    </Card>
  </main>;
}
