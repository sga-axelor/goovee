'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {Container, TableList} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSortBy} from '@/ui/hooks';
import {SUBAPP_CODES, URL_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import type {Quotations} from '@/subapps/quotations/common/types/quotations';
import {Columns} from '@/subapps/quotations/common/ui/components';

type Props = {
  quotations: Quotations[];
  pageInfo?: any;
};

const Content = (props: Props) => {
  const {quotations, pageInfo} = props;
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const [sortedQuotations, sortOrder, toggleSortOrder] = useSortBy(quotations);

  const handleClick = (quotation: any) =>
    router.push(`${workspaceURI}/${SUBAPP_CODES.quotations}/${quotation.id}`);

  return (
    <>
      <Container title={i18n.t('Quotations')}>
        <div className="flex flex-col gap-4">
          <TableList
            columns={Columns}
            rows={sortedQuotations}
            sort={sortOrder}
            onSort={toggleSortOrder}
            onRowClick={handleClick}
            pageInfo={pageInfo}
            pageParamKey={URL_PARAMS.page}
          />
        </div>
      </Container>
    </>
  );
};
export default Content;
