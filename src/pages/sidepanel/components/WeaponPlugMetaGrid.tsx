import React from 'react'
import { Avatar, Badge, Col, Divider, Row, Tag, Tooltip } from 'antd'
import { PlugDisplayData } from '@root/src/shared/d2items/itemInfo'

interface WeaponPlugMetaGridProps {
  plugs: PlugDisplayData[]
}

interface SidepanelPlugMetaGridItemProps {
  plugData: PlugDisplayData
}

const WeaponPlugMetaItem: React.FC<SidepanelPlugMetaGridItemProps> = ({ plugData }) => {
  const percentTagCSSProps: React.CSSProperties = {
    fontWeight: 700,
    textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
  }

  return (
    <Col span={6}>
      <Badge size="small" count={plugData.metaUsage.place} color={plugData.metaUsage.color}>
        <Tooltip title={plugData.name} trigger="hover">
          <Avatar src={plugData.icon} size={40} shape="circle" />
        </Tooltip>
      </Badge>
      <Tag style={percentTagCSSProps} color={plugData.metaUsage.color}>
        {plugData.metaUsage.percent}
      </Tag>
    </Col>
  )
}

const WeaponPlugMetaGrid: React.FC<WeaponPlugMetaGridProps> = ({ plugs }) => {
  // Calculate the maximum column and row values
  const maxCol = Math.max(...plugs.map(item => item.position[0]))
  const maxRow = Math.max(...plugs.map(item => item.position[1]))

  const grid: JSX.Element[][] = []
  for (let row = 0; row <= maxRow; row++) {
    const rowItems: JSX.Element[] = []
    for (let col = 0; col <= maxCol; col++) {
      const rowItem = plugs.find(d => d.position[0] === col && d.position[1] === row)
      if (rowItem) {
        rowItems.push(<WeaponPlugMetaItem plugData={rowItem} />)
      }
    }
    grid.push(rowItems)
  }

  //const maxCol = Math.max(...plugs.map((item) => item.position[0]))

  return (
    <div className="plug-meta-grid-container">
      <Divider style={{ fontSize: 'smaller' }}>Perks meta usage</Divider>
      {grid.map((row, index) => (
        <Row key={index} gutter={[24, 24]} style={{ paddingTop: '10px' }}>
          {row}
        </Row>
      ))}
    </div>
  )
}

export default WeaponPlugMetaGrid
