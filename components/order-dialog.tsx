"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageCircle, FileText } from "lucide-react"

export function OrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {"Siparis Ver"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {"Size en uygun yontemle siparisini olusturun."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3">
          <Button
            asChild
            size="lg"
            className="w-full justify-start gap-3 rounded-xl bg-[#25D366] text-base font-semibold text-white hover:bg-[#25D366]/90"
          >
            <a
              href="https://wa.me/908503033193"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-5" />
              {"WhatsApp ile siparis"}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3 rounded-xl border-border text-base font-semibold text-foreground"
            onClick={() => onOpenChange(false)}
          >
            <FileText className="size-5" />
            {"Form ile siparis"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
