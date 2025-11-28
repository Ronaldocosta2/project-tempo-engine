import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProject } from "@/hooks/useProjects";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectFormDialog = ({ open, onOpenChange }: ProjectFormDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("on-track");
  const [teamSize, setTeamSize] = useState("5");
  const [budget, setBudget] = useState("");

  const createProject = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProject.mutate({
      name,
      description: description || null,
      start_date: startDate,
      end_date: endDate,
      status,
      team_size: parseInt(teamSize),
      budget: budget || null,
      progress: 0,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("on-track");
        setTeamSize("5");
        setBudget("");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Novo Projeto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome do projeto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do projeto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">No Prazo</SelectItem>
                  <SelectItem value="at-risk">Em Risco</SelectItem>
                  <SelectItem value="delayed">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Tamanho da Equipe</Label>
              <Input
                id="teamSize"
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Orçamento</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="R$ 100.000,00"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
