import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';

const COLORS = {
  primaryBrown: '#4A2E1C',
  copper: '#B87333',
  gold: '#D4A017',
  saffron: '#DD7A1F',
  sand: '#F3E4C8',
  cream: '#FFF8E7',
};

interface BotpressChatbotProps {
  onSuggestion?: (text: string) => void;
}

export const BotpressChatbot: React.FC<BotpressChatbotProps> = ({ onSuggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // HTML content with Botpress integration
  const botpressHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Sanskrit AI Assistant</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
          height: 100vh;
          overflow: hidden;
        }
        #bp-web-widget-container {
          height: 100vh !important;
          width: 100% !important;
        }
        .bpWidget {
          max-width: 100% !important;
          height: 100% !important;
        }
      </style>
    </head>
    <body>
      <script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
      <script src="https://files.bpcontent.cloud/2025/12/07/16/20251207164035-GI07ZFLU.js"></script>
      
      <script>
        window.addEventListener('load', function() {
          setTimeout(function() {
            if (window.botpressWebChat) {
              window.botpressWebChat.sendEvent({ type: 'show' });
            }
          }, 500);
        });

        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'botpress') {
            console.log('Botpress message:', event.data);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <>
      {/* Floating AI Assistant Button */}
      <TouchableOpacity
        onPress={() => setIsExpanded(true)}
        style={styles.floatingButton}
        activeOpacity={0.8}
      >
        <View style={styles.buttonGradient}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color={COLORS.gold} />
          </View>
        </View>
        <Text style={styles.buttonText}>AI Help</Text>
      </TouchableOpacity>

      {/* Chatbot Modal */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsExpanded(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="sparkles" size={24} color={COLORS.gold} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Sanskrit AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Ask me about shlokas, meanings & more</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsExpanded(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={32} color={COLORS.copper} />
            </TouchableOpacity>
          </View>

          {/* Chatbot WebView or iframe */}
          {isWeb ? (
            <iframe
              srcDoc={botpressHTML}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'transparent',
              }}
              title="Sanskrit AI Assistant"
            />
          ) : (
            <WebView
              source={{ html: botpressHTML }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              bounces={false}
              scrollEnabled={true}
              onMessage={(event) => {
                // Handle messages from the chatbot
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.suggestion && onSuggestion) {
                    onSuggestion(data.suggestion);
                    setIsExpanded(false);
                  }
                } catch {
                  console.log('Message from chatbot:', event.nativeEvent.data);
                }
              }}
            />
          )}

          {/* Quick Actions Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Ask me to help with Sanskrit text, translations, or chandas analysis
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.saffron,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: COLORS.copper,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    position: 'relative',
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.saffron,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.gold}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryBrown,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.copper,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.sand,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.copper,
    textAlign: 'center',
    lineHeight: 18,
  },
});
