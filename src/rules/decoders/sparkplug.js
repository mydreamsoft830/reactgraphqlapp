import ProtoBuf from 'protobufjs'

// TODO: Dataset support and the other more advanced types
// https://www.npmjs.com/package/protobufjs

const SparkplugRoot = ProtoBuf.parse(
  'package org.eclipse.tahu.protobuf; message Payload { message Template { ' +
    'message Parameter { optional string name = 1;optional uint32 type = 2; oneof value { uint32 int_value = 3; uint64 long_value = 4; ' +
    'float float_value = 5; double double_value = 6; bool boolean_value = 7; string string_value = 8; ParameterValueExtension extension_value = 9; } ' +
    'message ParameterValueExtension { extensions 1 to max; } } optional string version = 1; repeated Metric metrics = 2; ' +
    'repeated Parameter parameters = 3; optional string template_ref = 4; optional bool is_definition = 5; extensions 6 to max; } ' +
    'message DataSet { ' +
    'message DataSetValue { oneof value { uint32 int_value = 1; uint64 long_value = 2; float float_value = 3; double double_value = 4; ' +
    'bool boolean_value = 5; string string_value = 6; DataSetValueExtension extension_value = 7; } ' +
    'message DataSetValueExtension { extensions 1 to max; } } ' +
    'message Row { repeated DataSetValue elements = 1; extensions 2 to max; } optional uint64 num_of_columns = 1; repeated string columns = 2; ' +
    'repeated uint32 types = 3; repeated Row rows = 4; extensions 5 to max; } ' +
    'message PropertyValue { optional uint32 type = 1; optional bool is_null = 2;  oneof value { uint32 int_value = 3; uint64 long_value = 4; ' +
    'float float_value = 5; double double_value = 6; bool boolean_value = 7; string string_value = 8; PropertySet propertyset_value = 9; ' +
    'PropertySetList propertysets_value = 10; PropertyValueExtension extension_value = 11; } ' +
    'message PropertyValueExtension { extensions 1 to max; } } ' +
    'message PropertySet { repeated string keys = 1; repeated PropertyValue values = 2; extensions 3 to max; } ' +
    'message PropertySetList { repeated PropertySet propertyset = 1; extensions 2 to max; } ' +
    'message MetaData { optional bool is_multi_part = 1; optional string content_type = 2; optional uint64 size = 3; optional uint64 seq = 4; ' +
    'optional string file_name = 5; optional string file_type = 6; optional string md5 = 7; optional string description = 8; extensions 9 to max; } ' +
    'message Metric { optional string name = 1; optional uint64 alias = 2; optional uint64 timestamp = 3; optional uint32 datatype = 4; ' +
    'optional bool is_historical = 5; optional bool is_transient = 6; optional bool is_null = 7; optional MetaData metadata = 8; ' +
    'optional PropertySet properties = 9; oneof value { uint32 int_value = 10; uint64 long_value = 11; float float_value = 12; double double_value = 13; ' +
    'bool boolean_value = 14; string string_value = 15; bytes bytes_value = 16; DataSet dataset_value = 17; Template template_value = 18; ' +
    'MetricValueExtension extension_value = 19; } ' +
    'message MetricValueExtension { extensions 1 to max; } } optional uint64 timestamp = 1; repeated Metric metrics = 2; optional uint64 seq = 3; ' +
    'optional string uuid = 4; optional bytes body = 5; extensions 6 to max; } '
).root

class Sparkplug {
  static decodeSparkplugB (payload) {
    if (typeof payload === 'string') payload = Buffer.from(payload, 'utf8')

    try {
      const SparkplugPayload = SparkplugRoot.lookupType(
        'org.eclipse.tahu.protobuf.Payload'
      )
      const message = SparkplugPayload.decode(payload)
      const object = SparkplugPayload.toObject(message, {
        longs: Number,
        enums: String,
        bytes: String
      })

      if (object.metrics) {
        object.metrics = object.metrics.map((metric) =>
          Sparkplug.rewriteMetric(metric)
        )
      }

      return object
    } catch (e) {
      throw new Error('Invalid Sparkplug payload')
    }
  }

  static rewriteMetric (metric) {
    const rewriteMetric = {
      name: metric.name
    }

    switch (metric.datatype) {
      case 1:
        rewriteMetric.type = 'Int8'
        rewriteMetric.value = metric.intValue
        break
      case 2:
        rewriteMetric.type = 'Int16'
        rewriteMetric.value = metric.intValue
        break
      case 3:
        rewriteMetric.type = 'Int32'
        rewriteMetric.value = metric.intValue
        break
      case 4:
        rewriteMetric.type = 'Int64'
        rewriteMetric.value = metric.longValue
        break
      case 5:
        rewriteMetric.type = 'UInt8'
        rewriteMetric.value = metric.intValue
        break
      case 6:
        rewriteMetric.type = 'UInt16'
        rewriteMetric.value = metric.intValue
        break
      case 7:
        rewriteMetric.type = 'UInt32'
        rewriteMetric.value = metric.longValue
        break
      case 8:
        rewriteMetric.type = 'UInt64'
        rewriteMetric.value = metric.longValue
        break
      case 9:
        rewriteMetric.type = 'Float'
        rewriteMetric.value = metric.floatValue
        break
      case 10:
        rewriteMetric.type = 'Double'
        rewriteMetric.value = metric.doubleValue
        break
      case 11:
        rewriteMetric.type = 'Boolean'
        rewriteMetric.value = metric.booleanValue
        break
      case 12:
        rewriteMetric.type = 'String'
        rewriteMetric.value = metric.stringValue
        break
      case 13:
        rewriteMetric.type = 'DateTime'
        rewriteMetric.value = metric.longValue
        break
      case 14:
        rewriteMetric.type = 'Text'
        rewriteMetric.value = metric.stringValue
        break
      case 15:
        rewriteMetric.type = 'UUID'
        rewriteMetric.value = metric.stringValue
        break
      default:
        throw new Error(`Unsupported Sparkplug data type id=${metric.datatype}`)
    }

    return rewriteMetric
  }
}

export default Sparkplug
