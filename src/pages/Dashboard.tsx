import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Filter,
  FolderKanban,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics Calculation
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter(p => p.status === "on-track").length;
  const atRiskProjects = projects.filter(p => p.status === "at-risk").length;
  const delayedProjects = projects.filter(p => p.status === "delayed").length;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;

  // Chart Data
  const statusData = [
    { name: 'No Prazo', value: onTrackProjects, color: '#22c55e' },
    { name: 'Em Risco', value: atRiskProjects, color: '#eab308' },
    { name: 'Atrasado', value: delayedProjects, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const topProjectsData = [...projects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      progress: p.progress,
      full_name: p.name
    }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">No Prazo</Badge>;
      case "at-risk":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Em Risco</Badge>;
      case "delayed":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Atrasado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header onNewProject={() => setIsDialogOpen(true)} />
      <ProjectFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <main className="container py-8 px-6 max-w-7xl mx-auto space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Executivo</h1>
            <p className="text-slate-400 mt-1">
              Visão estratégica do portfólio e indicadores de performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
              <Calendar className="mr-2 h-4 w-4" />
              Últimos 30 dias
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Projetos</CardTitle>
              <FolderKanban className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalProjects}</div>
              <p className="text-xs text-slate-500 mt-1">+2 novos este mês</p>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Saúde do Portfólio</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.round((onTrackProjects / (totalProjects || 1)) * 100)}%</div>
              <p className="text-xs text-slate-500 mt-1">Projetos no prazo</p>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Atenção Necessária</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{atRiskProjects + delayedProjects}</div>
              <p className="text-xs text-slate-500 mt-1">Projetos com problemas</p>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Progresso Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgProgress}%</div>
              <Progress value={avgProgress} className="h-1 mt-2 bg-white/10" indicatorClassName="bg-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Status Distribution */}
          <Card className="col-span-1 border-white/5 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-slate-400" />
                Distribuição de Status
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Projects Progress */}
          <Card className="col-span-1 lg:col-span-2 border-white/5 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-400" />
                Top Projetos em Execução
              </CardTitle>
              <CardDescription className="text-slate-400">
                Progresso dos projetos mais avançados do portfólio
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProjectsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val}%`} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="border-white/5 bg-white/5 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white">Resumo dos Projetos</CardTitle>
              <CardDescription className="text-slate-400">Gerencie todos os projetos ativos</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-[200px] bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Carregando dados...</div>
            ) : filteredProjects.length > 0 ? (
              <div className="rounded-md border border-white/5 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-white/5">
                      <TableHead className="text-slate-400">Projeto</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Progresso</TableHead>
                      <TableHead className="text-slate-400 hidden md:table-cell">Cronograma</TableHead>
                      <TableHead className="text-slate-400 hidden md:table-cell">Equipe</TableHead>
                      <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium text-slate-200">
                          <div className="flex flex-col">
                            <span className="text-base">{project.name}</span>
                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{project.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell className="w-[200px]">
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="h-2 bg-white/10" />
                            <span className="text-xs text-slate-400 w-8">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-400 text-sm">
                          {new Date(project.start_date).toLocaleDateString("pt-BR")} - {new Date(project.end_date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(3, project.team_size) }).map((_, i) => (
                              <div key={i} className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-slate-400">
                                U{i + 1}
                              </div>
                            ))}
                            {project.team_size > 3 && (
                              <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-slate-400">
                                +{project.team_size - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="hover:bg-white/10 cursor-pointer"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-white/10 cursor-pointer"
                                onClick={() => navigate(`/project/${project.id}/schedule`)}
                              >
                                Cronograma
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                                Arquivar Projeto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Nenhum projeto encontrado</h3>
                <p className="text-slate-500 mt-1">
                  {searchQuery ? "Tente ajustar sua busca." : "Comece criando seu primeiro projeto."}
                </p>
                {!searchQuery && (
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-500"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Novo Projeto
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
