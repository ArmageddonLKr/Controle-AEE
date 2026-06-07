// src/components/shared/AddSessaoForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddSessaoFormProps {
  criancaId: string;
  onSessaoAdded?: () => void;
}

export default function AddSessaoForm({ criancaId: _criancaId }: AddSessaoFormProps) {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Funcionalidade em breve',
          description: 'O cadastro de novas sessões estará disponível na próxima fase.',
        })
      }
      variant="outline"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Nova Sessão
    </Button>
  );
}
