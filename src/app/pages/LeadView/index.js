import { useLocation } from 'react-router-dom';
import {
  Layout, theme,
} from 'antd';
import { getQueryParams } from 'utils/helpers';
import LeadModal from 'app/modules/LeadModal';
import { env } from 'utils/constants';

const { Content } = Layout;
function LeadView() {
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { itemId, boardId } = getQueryParams(location);
  return (
    <Content
      style={{
        padding: 8,
        margin: 0,
        minHeight: 280,
        borderRadius: borderRadiusLG,
      }}
    >
      <LeadModal
        show
        handleClose={() => {}}
        closeIcon={false}
        leadId={itemId}
        board={env.boards[boardId]}
      />
    </Content>
  );
}

export default LeadView;
