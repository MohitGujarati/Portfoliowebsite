import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { Linking, Platform } from 'react-native';

const documents: Record<string, number> = {
  resume: require('../assets/Mohit_Gujarati_Resume.pdf'),
  'parkinsons-detection': require('../assets/papers/parkinsons-detection-handwriting.pdf'),
  'bert-news-recommendation': require('../assets/papers/bert-news-recommendation.pdf'),
  'pytorch-vs-tensorflow': require('../assets/papers/pytorch-vs-tensorflow-survey.pdf'),
  'tensorflow-review': require('../assets/papers/tensorflow-system-review.pdf'),
  microservices: require('../assets/papers/microservices-distributed-systems.pdf'),
};
export async function openDocument(key: string) {
  const module = documents[key];
  if (!module) throw new Error('This document is unavailable.');
  const asset = Asset.fromModule(module);
  if (Platform.OS === 'web') {
    await Linking.openURL(asset.uri);
    return;
  }
  await asset.downloadAsync();
  if (!(await Sharing.isAvailableAsync())) throw new Error('PDF sharing is unavailable on this device.');
  await Sharing.shareAsync(asset.localUri || asset.uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: key === 'resume' ? 'Mohit Gujarati — Résumé' : 'Research paper',
  });
}
