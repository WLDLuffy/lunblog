import { Card, Typography, Tag, Space } from 'antd';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';
import Text from 'antd/es/typography';

interface ResumeCardProps {
  item: {
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
  };
}

export function ResumeCard({ item }: ResumeCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const startDateStr = formatDate(item.startDate);
  const endDateStr = item.endDate ? formatDate(item.endDate) : 'Present';
  const isCurrent = !item.endDate;

  return (
    <Card hoverable style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <Title style={{ marginBottom: 8 }}>{item.position}</Title>
          <Title style={{ fontWeight: 500, marginTop: 0 }}>
            {item.company}
          </Title>
        </div>
        <Space>
          {isCurrent && (
            <Tag color="blue">Current</Tag>
          )}
          <Text style={{ whiteSpace: 'nowrap' }}>
            {startDateStr} - {endDateStr}
          </Text>
        </Space>
      </div>
      <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap', marginTop: 16 }}>
        {item.description}
      </Paragraph>
    </Card>
  );
}
