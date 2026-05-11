import {z} from 'zod';
import {MOUNT_TYPE} from '../constants';

export const MountTypeSchema = z.enum(MOUNT_TYPE);

export type MountType = z.infer<typeof MountTypeSchema>;
