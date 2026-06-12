// src/app/alunos/perfil/AlunoPerfil.tsx
// Conteúdo do perfil da criança: coluna lateral com dados + abas de conteúdo
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { differenceInYears, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Phone, Trash2, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCriancaById, useSessoesByCriancaId, useEvolucoesByCriancaId } from '@/hooks/useAlunos';
import { removeCrianca } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ExportButton } from '@/components/shared/ExportButton';
import SessoesList from '@/components/shared/SessoesList';
import AddSessaoForm from '@/components/shared/AddSessaoForm';
import AddEvolucaoForm from '@/components/shared/AddEvolucaoForm';
import { exportarFichaCriancaPDF } from '@/lib/utils/export-pdf';
import { exportarFichaCriancaDocx } from '@/lib/utils/export-docx';

const STATUS_LABEL = { ativo: 'Ativo', espera: 'Em espera', inativo: 'Inativo' } as const;
const TURNO_LABEL = { 'manhã': 'Manhã', tarde: 'Tarde', integral: 'Integral' } as const;

function Carregando() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

function NaoEncontrada() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 gap-3">
      <UserX size={44} style={{ color: 'var(--text-muted)' }} />
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Criança não encontrada
      </h2>
      <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
        O cadastro pode ter sido removido ou o link está incorreto.
      </p>
      <Link
        href="/alunos"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'var(--accent-primary)' }}
      >
        <ArrowLeft size={16} /> Voltar para Crianças
      </Link>
    </div>
  );
}

function LinhaInfo({ rotulo, valor }: { rotulo: string; valor?: string }) {
  if (!valor) return null;
  return (
    <p className="text-sm">
      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{rotulo}: </span>
      <span style={{ color: 'var(--text-primary)' }}>{valor}</span>
    </p>
  );
}

export default function AlunoPerfil({ id }: { id?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { crianca, loading } = useCriancaById(id);
  const { sessoes } = useSessoesByCriancaId(id);
  const { evolucoes } = useEvolucoesByCriancaId(id);
  const [excluindo, setExcluindo] = useState(false);

  if (loading) return <Carregando />;
  if (!crianca) return <NaoEncontrada />;

  const idade = differenceInYears(new Date(), new Date(crianca.dataNascimento));
  const presentes = sessoes.filter((s) => s.presente).length;
  const taxaPresenca = sessoes.length > 0 ? Math.round((presentes / sessoes.length) * 100) : null;
  const sessoesOrdenadas = [...sessoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  function handleExcluir() {
    if (!crianca) return;
    removeCrianca(crianca.id);
    toast({
      title: 'Cadastro removido',
      description: `${crianca.nome} e todos os registros vinculados foram excluídos.`,
    });
    router.push('/alunos');
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/alunos"
        className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit"
        style={{ color: 'var(--accent-primary)' }}
      >
        <ArrowLeft size={16} /> Crianças
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Coluna lateral ── */}
        <aside className="lg:col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader className="items-center text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)' }}
              >
                {crianca.nome.charAt(0).toUpperCase()}
              </div>
              <CardTitle className="text-xl pt-3">{crianca.nome}</CardTitle>
              <Badge variant={crianca.status === 'ativo' ? 'success' : 'secondary'}>
                {STATUS_LABEL[crianca.status]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <LinhaInfo rotulo="Idade" valor={`${idade} ${idade === 1 ? 'ano' : 'anos'}`} />
              <LinhaInfo
                rotulo="Nascimento"
                valor={format(new Date(crianca.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
              />
              <LinhaInfo rotulo="Escola" valor={crianca.escola} />
              <LinhaInfo rotulo="Turma" valor={crianca.turma} />
              <LinhaInfo rotulo="Série" valor={crianca.serie} />
              <LinhaInfo rotulo="Turno" valor={crianca.turno ? TURNO_LABEL[crianca.turno] : undefined} />
              <LinhaInfo
                rotulo="Início do acompanhamento"
                valor={format(new Date(crianca.dataInicioAcompanhamento), 'dd/MM/yyyy', { locale: ptBR })}
              />

              {crianca.diagnosticos.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Diagnósticos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {crianca.diagnosticos.map((d) => (
                      <Badge key={d} variant="secondary">{d}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {crianca.observacoesImportantes && (
                <div
                  className="mt-3 rounded-lg p-3 text-sm"
                  style={{ background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.35)', color: 'var(--text-primary)' }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--warning)' }}>⚠️ Observações importantes</p>
                  {crianca.observacoesImportantes}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mini-estatísticas */}
          <Card>
            <CardContent className="pt-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>{sessoes.length}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sessões</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                  {taxaPresenca === null ? '—' : `${taxaPresenca}%`}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Presença</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>{evolucoes.length}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Evoluções</p>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* ── Área principal com abas ── */}
        <main className="lg:col-span-3">
          <Tabs defaultValue="sessoes">
            <TabsList className="mb-4 flex-wrap h-auto">
              <TabsTrigger value="sessoes">📓 Sessões ({sessoes.length})</TabsTrigger>
              <TabsTrigger value="evolucao">📈 Evolução ({evolucoes.length})</TabsTrigger>
              <TabsTrigger value="informacoes">📋 Informações</TabsTrigger>
              <TabsTrigger value="exportar">📤 Exportar</TabsTrigger>
            </TabsList>

            <TabsContent value="sessoes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                  <CardTitle>Histórico de Sessões</CardTitle>
                  <AddSessaoForm criancaId={crianca.id} />
                </CardHeader>
                <CardContent>
                  <SessoesList criancaId={crianca.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolucao">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                  <CardTitle>Registros de Evolução</CardTitle>
                  <AddEvolucaoForm criancaId={crianca.id} />
                </CardHeader>
                <CardContent className="space-y-4">
                  {evolucoes.length === 0 ? (
                    <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      Nenhum registro de evolução ainda. Use o botão acima para adicionar o primeiro.
                    </p>
                  ) : (
                    [...evolucoes]
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map((ev) => (
                        <div key={ev.id} className="rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                              {ev.periodo}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {format(new Date(ev.data), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          {ev.areas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {ev.areas.map((a) => (
                                <Badge key={a} variant="secondary">{a}</Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                            {ev.descricao}
                          </p>
                          {ev.proximosPassos && (
                            <p className="text-sm mt-2 italic" style={{ color: 'var(--text-muted)' }}>
                              Próximos passos: {ev.proximosPassos}
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="informacoes">
              <Card>
                <CardHeader><CardTitle>Informações Completas</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>
                      👨‍👩‍👧 Responsáveis
                    </h3>
                    {crianca.responsaveis.length === 0 ? (
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum responsável cadastrado.</p>
                    ) : (
                      <div className="space-y-2">
                        {crianca.responsaveis.map((r, i) => (
                          <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg-primary)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {r.nome} <span style={{ color: 'var(--text-muted)' }}>({r.parentesco})</span>
                            </p>
                            {r.telefone && (
                              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                <Phone size={12} /> {r.telefone}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>
                      🏫 Escola
                    </h3>
                    <LinhaInfo rotulo="Escola" valor={crianca.escola || 'Não informada'} />
                    <LinhaInfo rotulo="Turma" valor={crianca.turma} />
                    <LinhaInfo rotulo="Série" valor={crianca.serie} />
                    <LinhaInfo rotulo="Professor(a) regente" valor={crianca.professorRegente} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>
                      🩺 Dados Clínicos
                    </h3>
                    <LinhaInfo rotulo="Diagnósticos" valor={crianca.diagnosticos.join(', ') || 'Nenhum informado'} />
                    <LinhaInfo rotulo="CIDs" valor={crianca.cids.join(', ')} />
                    <LinhaInfo rotulo="Medicamentos" valor={crianca.medicamentos?.join(', ')} />
                    <LinhaInfo rotulo="Alergias" valor={crianca.alergias?.join(', ')} />
                  </div>

                  <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    {excluindo ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                          Excluir {crianca.nome}? Todas as sessões e evoluções também serão apagadas. Essa ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="destructive" size="sm" onClick={handleExcluir}>
                            Sim, excluir tudo
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setExcluindo(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setExcluindo(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir cadastro
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exportar">
              <Card>
                <CardHeader><CardTitle>Exportar Ficha da Criança</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Gera a ficha completa de {crianca.nome.split(' ')[0]} com dados pessoais,
                    histórico de sessões e registros de evolução, pronta para impressão ou envio.
                  </p>
                  <ExportButton
                    opcoes={[
                      {
                        label: 'Exportar PDF',
                        formato: 'pdf',
                        onExportar: () => exportarFichaCriancaPDF(crianca, sessoesOrdenadas, evolucoes),
                      },
                      {
                        label: 'Exportar Word',
                        formato: 'word',
                        onExportar: () => exportarFichaCriancaDocx(crianca, sessoesOrdenadas, evolucoes),
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
