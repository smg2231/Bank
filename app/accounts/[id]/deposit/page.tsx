import DepositBox from "@/components/sheena/Deposit";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <DepositBox accountId={params.id} />;
}