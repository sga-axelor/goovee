import crypto, {type BinaryLike} from 'crypto';

const OperationMode = {
  CBC: 'cbc',
  GCM: 'gcm',
};

export class Encryptor {
  static AES_ALGORITHM = 'aes-256';
  static ALGORITHM = 'sha1';
  static ITERATIONS = 1024;
  static KEY_LENGTH = 32;
  static IV_SIZE = 16;
  static SALT_SIZE = 8;

  static PREFIX = '$AES$';
  static PREFIX_BYTES = Buffer.from(Encryptor.PREFIX, 'utf8');

  mode: string;
  password: string;
  transformation: string;
  encryptionSalt: BinaryLike;
  encryptionKey: BinaryLike;
  payloadSize: number;

  constructor(mode = OperationMode.CBC, password: string) {
    this.mode = mode;
    this.password = password;
    this.transformation = `${Encryptor.AES_ALGORITHM}-${mode}`;
    this.encryptionSalt = crypto.randomBytes(Encryptor.SALT_SIZE);
    this.encryptionKey = this.newSecretKey(password, this.encryptionSalt);
    this.payloadSize =
      mode === OperationMode.CBC
        ? Encryptor.PREFIX_BYTES.length + Encryptor.SALT_SIZE
        : Encryptor.PREFIX_BYTES.length +
          Encryptor.SALT_SIZE +
          Encryptor.IV_SIZE;
  }

  newSecretKey(password: string, salt: BinaryLike) {
    return crypto.pbkdf2Sync(
      password,
      salt,
      Encryptor.ITERATIONS,
      Encryptor.KEY_LENGTH,
      Encryptor.ALGORITHM,
    );
  }

  encrypt(value: string) {
    const iv =
      this.mode === OperationMode.CBC
        ? Buffer.alloc(Encryptor.IV_SIZE)
        : crypto.randomBytes(Encryptor.IV_SIZE);

    const cipher = crypto.createCipheriv(
      this.transformation,
      this.encryptionKey,
      iv,
    );

    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return this.mode === OperationMode.CBC
      ? Buffer.concat([
          Encryptor.PREFIX_BYTES,
          this.encryptionSalt as any,
          Buffer.from(encrypted, 'base64'),
        ]).toString('base64')
      : Buffer.concat([
          Encryptor.PREFIX_BYTES,
          this.encryptionSalt as any,
          iv,
          Buffer.from(encrypted, 'base64'),
        ]).toString('base64');
  }

  decrypt(value: string) {
    const bytes = Buffer.from(value, 'base64');

    const salt = Buffer.alloc(Encryptor.SALT_SIZE);
    const iv = Buffer.alloc(Encryptor.IV_SIZE);
    const data = Buffer.alloc(bytes.length - this.payloadSize);

    const sections =
      this.mode === OperationMode.CBC ? [salt, data] : [salt, iv, data];

    let index = Encryptor.PREFIX_BYTES.length;

    for (let section of sections) {
      bytes.copy(section, 0, index, index + section.length);
      index += section.length;
    }

    const key = this.newSecretKey(this.password, salt);
    const decipher = crypto.createDecipheriv(this.transformation, key, iv);

    let decrypted = decipher.update(data, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

const secret = process.env.AOS_SECRET!;
const encryptor = new Encryptor(OperationMode.CBC, secret);

export default encryptor;
