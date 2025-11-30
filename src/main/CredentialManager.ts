// Credential encryption service using Electron's safeStorage API
//
// This service encrypts sensitive credentials (AWS keys, tokens) before storing them
// in profiles.json. It uses Electron's safeStorage which leverages OS-level keychains:
// - macOS: Keychain
// - Windows: DPAPI
// - Linux: libsecret (or plain text if unavailable)

import { safeStorage } from 'electron';

export class CredentialManager {
  /**
   * Checks if OS-level encryption is available on this platform
   * @returns true if safeStorage encryption is available
   */
  static isEncryptionAvailable(): boolean {
    return safeStorage.isEncryptionAvailable();
  }

  /**
   * Encrypts a plaintext credential using OS-level encryption
   * @param plaintext The credential to encrypt (e.g., AWS secret key)
   * @returns Base64-encoded encrypted string
   * @throws Error if encryption is unavailable or fails
   */
  static encrypt(plaintext: string): string {
    if (!plaintext) {
      return '';
    }

    // Check if encryption is available on this platform
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error(
        'OS-level credential encryption is not available on this system. ' +
        'On Linux, ensure libsecret is installed. ' +
        'Manual S3 credentials cannot be stored without encryption.'
      );
    }

    try {
      const buffer = safeStorage.encryptString(plaintext);
      // Return base64-encoded encrypted buffer for JSON storage
      return buffer.toString('base64');
    } catch (error) {
      console.error('Failed to encrypt credential:', error);
      throw new Error(`Credential encryption failed: ${(error as Error).message}`);
    }
  }

  /**
   * Decrypts an encrypted credential
   * @param encrypted Base64-encoded encrypted string
   * @returns Decrypted plaintext credential
   * @throws Error if decryption is unavailable or fails
   */
  static decrypt(encrypted: string): string {
    if (!encrypted) {
      return '';
    }

    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error(
        'OS-level credential decryption is not available on this system. ' +
        'Cannot load stored S3 credentials.'
      );
    }

    try {
      const buffer = Buffer.from(encrypted, 'base64');
      return safeStorage.decryptString(buffer);
    } catch (error) {
      console.error('Failed to decrypt credential:', error);
      throw new Error(`Credential decryption failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encrypts S3 credentials in-place (modifies the config object)
   * @param config S3 config object with plaintext credentials
   * @returns Same object with encrypted secretKey and sessionToken
   */
  static encryptS3Config<T extends { secretKey?: string; sessionToken?: string }>(
    config: T
  ): T {
    if (config.secretKey) {
      config.secretKey = this.encrypt(config.secretKey);
    }
    if (config.sessionToken) {
      config.sessionToken = this.encrypt(config.sessionToken);
    }
    return config;
  }

  /**
   * Decrypts S3 credentials in-place (modifies the config object)
   * @param config S3 config object with encrypted credentials
   * @returns Same object with decrypted secretKey and sessionToken
   */
  static decryptS3Config<T extends { secretKey?: string; sessionToken?: string }>(
    config: T
  ): T {
    if (config.secretKey) {
      config.secretKey = this.decrypt(config.secretKey);
    }
    if (config.sessionToken) {
      config.sessionToken = this.decrypt(config.sessionToken);
    }
    return config;
  }
}
