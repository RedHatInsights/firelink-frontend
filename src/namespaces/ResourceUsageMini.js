import React from 'react';
import {
  Progress,
  ProgressVariant,
  ProgressMeasureLocation,
  Tooltip,
  Content,
  ContentVariants,
  Skeleton
} from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import { 
  getNamespaceResources,
  getNamespaceResourcesLoading 

} from '../store/ListSlice';

const ResourceUsageMini = ({ namespace, resource, showDetails = false }) => {
  const data = useSelector(getNamespaceResources);
  const loading = useSelector(getNamespaceResourcesLoading);
  

  if (!data[namespace] && showDetails) {
    return <Skeleton />;
  }
  if (!data[namespace]) {
    return <div/>;
  }


  const usage = data[namespace].usage[resource];
  const requests = data[namespace].requests[resource];
  const limits = data[namespace].limits[resource];

  let variant = ProgressVariant.success;
  if (usage > requests) {
    variant = usage > limits * 0.8 ? ProgressVariant.danger : ProgressVariant.warning;
  }

  const percentage = (usage / limits) * 100;
  const usagePercentageOfRequests = (usage / requests) * 100;
  const usagePercentageOfLimits = (usage / limits) * 100;

  const formatResourceValue = (value) => {
    if (resource === 'memory') {
      return `${(value / 1024).toFixed(2)} GB`;
    }
    return `${value.toFixed(2)} cores`;
  };

  const tooltipContent = `
    Usage: ${formatResourceValue(usage)} (${usagePercentageOfLimits.toFixed(2)}% of limits, ${usagePercentageOfRequests.toFixed(2)}% of requests)
    Requests: ${formatResourceValue(requests)}
    Limits: ${formatResourceValue(limits)}
  `;

  return (
    <div>
      {showDetails && (
        <Content>
          <Content component={ContentVariants.h6}>{resource.toUpperCase()}</Content>
        </Content>
      )}
      <Tooltip content={tooltipContent}>
        <Progress
          value={percentage}
          measureLocation={showDetails ? ProgressMeasureLocation.outside : ProgressMeasureLocation.none}
          variant={variant}
          label={showDetails ? `${percentage.toFixed(2)}%` : ''}
        />
      </Tooltip>
      {showDetails && (
        <Content>
          <Content component="p">{tooltipContent.trim().split('\n').map(line => <div key={line}>{line}</div>)}</Content>
        </Content>
      )}
    </div>
  );
};

export default ResourceUsageMini;