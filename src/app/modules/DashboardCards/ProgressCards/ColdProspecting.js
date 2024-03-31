import ProgressCard from 'app/components/ProgressCard';
import { SnowIcon } from 'app/images/icons';
import en from 'app/locales/en';
import { useEffect, useState } from 'react';
import monday from 'utils/mondaySdk';

function ColdProspecting() {
  const [data, setData] = useState();

  useEffect(() => {
    monday.api(`query {
      me {
        name
      }
      boards(ids: [5544986448]) {
        name
        groups {
          items_page {
            items {
              id
            }
          }
          title
          id
        }
      }
    }`).then((res) => { setData(res); });
  }, []);
  console.log(data);
  const value = data?.data ? data.data.boards[0].groups[0].items_page.items.length : 0;
  const total = data?.data ? data.data.boards[0].groups[1].items_page.items.length : 0;
  return (
    <ProgressCard
      value={value}
      total={total + value}
      title={en.Cards.progess.coldProspecting.title}
      subTitle={en.Cards.progess.coldProspecting.subtitle}
      color="#1A4049"
      icon={<SnowIcon />}
    />
  );
}

export default ColdProspecting;
