import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    machineName?: string;
};

const ConfirmReportModal = ({ isOpen, onClose, onConfirm}: ConfirmReportModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Maintenance Issue</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you want to report a maintenance issue for this machine?
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" className="bg-gray-400 text-white hover:bg-gray-500" onClick={onClose}>No</Button>
                    </DialogClose>
                    <Button className="bg-red-500 text-white" onClick={onConfirm}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmReportModal;
