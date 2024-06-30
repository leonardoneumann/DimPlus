import React from 'react'
import { Avatar, Col, Row, Tag, Tooltip } from 'antd'
import { percentTagCSSProps } from './SharedCSSProps'
import { MetaComboDescription, MetaCombos } from '@root/src/scrapers/lightgg'

interface PlugComboMetaGridProps {
  metaCombos: MetaCombos
}

interface PlugComboMetaGridItemProps {
  plugComboData: MetaComboDescription
}

const PlugComboMetaGrid: React.FC<PlugComboMetaGridProps> = ({ metaCombos }) => {
  return (
    <Row gutter={[18, 18]} style={{ paddingTop: '10px' }}>
      {metaCombos.combos.map((row, index) => (
        <PlugComboMetaGridItem key={index} plugComboData={row} />
      ))}
    </Row>
  )
}

const PlugComboMetaGridItem: React.FC<PlugComboMetaGridItemProps> = ({ plugComboData }) => {
  return (
    <Col span={6} style={percentTagCSSProps}>
      <Tooltip title={plugComboData.names} trigger="hover">
        <Avatar src={plugComboData.imgs[0]} size={40} shape="circle" />
        <Avatar src={plugComboData.imgs[1]} size={40} shape="circle" />
      </Tooltip>
      <Tag>{plugComboData.percentText}</Tag>
    </Col>
  )
}

export default PlugComboMetaGrid
