
import { getCurrentUser } from '@/actions/auth.actions';
import Agent from '@/components/ui/Agent';


export default async function Interview() {
  const user = await getCurrentUser();
  console.log({ user });
  return <div>
    <Agent userId={user?.id} />
  </div>
}