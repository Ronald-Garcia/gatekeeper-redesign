import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

type ReportFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  machineId: number;
};

const ReportFormModal = ({ isOpen, onClose, userId, machineId }: ReportFormModalProps) => {
  const formUrl = `${window.location.origin}/form/${userId}/${machineId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Form</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 text-center">
          <p>Scan the QR code to submit a maintenance report.</p>
          <QRCodeSVG value={formUrl} size={200} />
          <p className="text-xs break-all text-gray-500">{formUrl}</p>
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


