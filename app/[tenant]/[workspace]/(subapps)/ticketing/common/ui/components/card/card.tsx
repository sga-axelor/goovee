'use client';

import {cn} from '@/utils/css';

import styles from './card.module.scss';

type CardProps = {
  projectName: string;
  totalTickets: number;
};

export function Card(props: CardProps) {
  const {projectName, totalTickets} = props;
  return (
    <div className={cn('mb-5', styles['card'])}>
      <p className="text-[1rem] font-semibold">{projectName}</p>
      <p className="text-[12px] font-semibold">{totalTickets} tickets</p>
    </div>
  );
}
