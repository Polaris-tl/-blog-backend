import { SetMetadata } from '@nestjs/common';
export const SkipLoginCheckKey = Symbol.for('skip-login-check');
export const SkipLoginCheck = (required: boolean = true) =>
  SetMetadata(SkipLoginCheckKey, required);
