import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stakeholder } from "@/hooks/useStakeholders";

interface StakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stakeholder: Partial<Stakeholder>) => void;
  stakeholder?: Stakeholder | null;
  projectId: string;
}

export const StakeholderDialog = ({
  open,
  onOpenChange,
  onSave,
  stakeholder,
  projectId,
}: StakeholderDialogProps) => {
  const [formData, setFormData] = useState<Partial<Stakeholder>>({
    name: "",
    role: "",
    email: "",
    phone: "",
    power_level: 3,
    interest_level: 3,
    influence: "media",
    expectation: "",
    communication_preference: "",
    notes: "",
    project_id: projectId,
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData(stakeholder);
    } else {
      setFormData({
        name: "",
        role: "",
        email: "",
        phone: "",
        power_level: 3,
        interest_level: 3,
        influence: "media",
        expectation: "",
        communication_preference: "",
        notes: "",
        project_id: projectId,
      });
    }
  }, [stakeholder, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {stakeholder ? "Editar Stakeholder" : "Novo Stakeholder"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo/Função *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Gerente de TI"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="power_level">Nível de Poder (1-5)</Label>
              <Input
                id="power_level"
                type="number"
                min="1"
                max="5"
                value={formData.power_level}
                onChange={(e) =>
                  setFormData({ ...formData, power_level: parseInt(e.target.value) || 3 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest_level">Nível de Interesse (1-5)</Label>
              <Input
                id="interest_level"
                type="number"
                min="1"
                max="5"
                value={formData.interest_level}
                onChange={(e) =>
                  setFormData({ ...formData, interest_level: parseInt(e.target.value) || 3 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="influence">Influência</Label>
              <Select
                value={formData.influence}
                onValueChange={(value: "baixa" | "media" | "alta") =>
                  setFormData({ ...formData, influence: value })
                }
              >
                <SelectTrigger id="influence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectation">Expectativas</Label>
            <Textarea
              id="expectation"
              value={formData.expectation || ""}
              onChange={(e) => setFormData({ ...formData, expectation: e.target.value })}
              placeholder="Descreva as expectativas do stakeholder..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="communication_preference">Preferência de Comunicação</Label>
            <Input
              id="communication_preference"
              value={formData.communication_preference || ""}
              onChange={(e) =>
                setFormData({ ...formData, communication_preference: e.target.value })
              }
              placeholder="Ex: Email semanal, Reunião mensal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Anotações adicionais..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
