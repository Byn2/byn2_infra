import QRCode from 'qrcode';
import { createCanvas } from 'canvas';
import { CloudinaryService } from './cloudinary';

export interface QRCodeOptions {
  walletAddress: string;
  size?: number;
  margin?: number;
}

export class QRService {
  /**
   * Generates a QR code for a wallet address and uploads it to Cloudinary
   * @param options QR code generation options
   * @returns Promise<string> - The secure URL of the uploaded QR code
   */
  static async generateWalletQRCode(options: QRCodeOptions): Promise<string> {
    const { walletAddress, size = 400, margin = 2 } = options;
    
    try {
      // Create canvas for QR code
      const canvas = createCanvas(size, size);
      
      // Generate QR code on canvas
      await QRCode.toCanvas(canvas, walletAddress, {
        width: size,
        margin: margin,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      // Convert canvas to JPG buffer
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
      
      // Convert to base64 data URL for Cloudinary upload
      const base64Data = `data:image/jpeg;base64,${buffer.toString('base64')}`;

      // Create a unique public_id based on wallet address hash
      const publicId = `qr-codes/wallet-${Buffer.from(walletAddress).toString('hex').substring(0, 16)}`;

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadFile(base64Data, {
        folder: 'qr-codes',
        public_id: publicId,
        resource_type: 'image',
        overwrite: true, // Always overwrite to ensure fresh QR codes
        transformation: {
          format: 'jpg',
          quality: 'auto:good'
        }
      });

      return uploadResult.secure_url;
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw new Error('Failed to generate QR code for wallet address');
    }
  }

  /**
   * Generates a QR code and returns it as a base64 data URL (fallback method)
   * @param walletAddress The wallet address to encode
   * @returns Promise<string> - Base64 data URL
   */
  static async generateQRCodeDataURL(walletAddress: string): Promise<string> {
    try {
      // Generate QR code as data URL directly
      const dataUrl = await QRCode.toDataURL(walletAddress, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return dataUrl;
    } catch (error) {
      console.error('QR Code data URL generation error:', error);
      throw error;
    }
  }
}

export default QRService;