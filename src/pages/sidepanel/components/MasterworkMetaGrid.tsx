import React from 'react'
import { Avatar, Col, Row, Tag, Tooltip } from 'antd'
import { percentTagCSSProps } from './SharedCSSProps'
import { MetaComboDescription, MetaCombos } from '@root/src/scrapers/lightgg'

interface MasterworkMetaGridProps {
  metaCombos: MetaCombos
}

interface MasterworkMetaGridItemProps {
  masterworkData: MetaComboDescription
}

const MasterworkMetaGrid: React.FC<MasterworkMetaGridProps> = ({ metaCombos }) => {
  return (
    <Row gutter={[20, 20]} style={{ paddingTop: '10px' }}>
      {metaCombos.masterwork.map((row, index) => (
        <MasterworkMetaItem key={index} masterworkData={row} />
      ))}
    </Row>
  )
}

const MasterworkMetaItem: React.FC<MasterworkMetaGridItemProps> = ({ masterworkData }) => {
  return (
    <Col span={6} style={percentTagCSSProps}>
      <Tooltip title={masterworkData.names} trigger="hover">
        <Avatar src={masterworkData.imgs[0]} size={40} shape="square" />
      </Tooltip>
      <Tag>{masterworkData.percentText}</Tag>
    </Col>
  )
}

export default MasterworkMetaGrid
