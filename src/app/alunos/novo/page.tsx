import { PageHeader } from "@/components/layout/PageHeader";
import { AlunoForm } from "@/components/shared/AlunoForm";
import { Card, CardContent } from "@/components/ui/card";

export default function NovoAlunoPage() {
  return (
    <div>
      <PageHeader
        title="Novo Aluno"
        description="Cadastre um novo aluno no sistema AEE"
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <AlunoForm />
        </CardContent>
      </Card>
    </div>
  );
}
