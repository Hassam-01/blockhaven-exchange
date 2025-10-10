import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  className?: string;
}

export function QRCodeComponent({ 
  value, 
  size = 200, 
  title, 
  showCopy = true, 
  showDownload = true,
  className = "" 
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return;

      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setIsGenerated(true);
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate QR code"
        });
      }
    };

    generateQR();
  }, [value, size, toast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard"
      });
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current || !isGenerated) return;

    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `qr-code-${title || 'deposit'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "QR code saved to downloads"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download QR code"
      });
    }
  };

  return (
    <div className={`flex flex-col items-center ${(showCopy || showDownload || title) ? 'space-y-3' : ''} ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-center">{title}</h3>
      )}
      
      <div className="p-2 bg-white rounded-lg border border-muted">
        <canvas 
          ref={canvasRef}
          className="block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {(showCopy || showDownload) && (
        <div className="flex gap-2">
          {showCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>
          )}
          
          {showDownload && isGenerated && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQR}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      )}

      {value && showCopy && (
        <p className="text-xs text-muted-foreground text-center break-all max-w-xs font-mono">
          {value}
        </p>
      )}
    </div>
  );
}