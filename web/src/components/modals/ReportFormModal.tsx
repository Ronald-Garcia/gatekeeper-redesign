import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

type ReportFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ReportFormModal = ({ isOpen, onClose }: ReportFormModalProps) => {
  const formUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // ← hardcoded QR code URL to be put here
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Form</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 text-center">
          <p>Please scan this QR code to complete the maintenance report form.</p>
          <QRCodeSVG value={formUrl} size={200} />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button onClick={onClose}>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormModal;

