import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, StatusBar, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore, SignupOrigin } from '@/stores/authStore';
import { Mail, Lock, User, ArrowRight, AlertCircle, Github, Linkedin } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TicketbirdLogo } from '../components/TicketbirdLogo';
import { Svg, Path } from 'react-native-svg';

// Google logo component with inline SVG
const GoogleLogo = () => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <Path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <Path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <Path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </Svg>
    </View>
  </View>
);

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signup, signInWithProvider, isLoading, error } = useAuthStore();
  
  // Get the signup origin from route params or default to mobile_app
  const origin = (params.origin as SignupOrigin) || 'mobile_app';
  const referrer = params.referrer as string;
  
  // Clear errors when inputs change
  useEffect(() => {
    if (error) {
      // Clear any auth store errors when user types
      useAuthStore.setState({ error: null });
    }
    if (validationError) {
      setValidationError(null);
    }
  }, [email, password, confirmPassword, username, error, validationError]);
  
  const validateForm = () => {
    if (!username) {
      setValidationError('Username is required');
      return false;
    }
    
    if (!email) {
      setValidationError('Email address is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setValidationError('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleSignup = async () => {
    console.log('[UI:Signup] Signup button pressed with:', { email, username, origin, referrer });
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('[UI:Signup] Calling authStore.signup()');
      await signup(email, password, username, origin, referrer);
      console.log('[UI:Signup] Signup completed, navigating to login');
      
      // Navigate to login with success message
      router.push({
        pathname: '/login',
        params: { message: 'Account created! Please check your email to confirm your account.' }
      } as any);
    } catch (e) {
      console.error('[UI:Signup] Unhandled error during signup:', e);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSocialSignup = (provider: 'google' | 'linkedin' | 'github') => {
    console.log(`[UI:Signup] Social signup requested with ${provider}`);
    signInWithProvider(provider);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Full-height background image with overlay */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      
      {/* Content container */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContainer}>
          {/* Header section with branding */}
          <Animated.View 
            entering={FadeIn.delay(200)}
            style={styles.header}
          >   
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TicketbirdLogo size={48} color="#fff" /><Text style={styles.title}>FlutterPass</Text>
            </View>
            <Text style={styles.subtitle}>Create your account</Text>
          </Animated.View>

          {/* Form container with glass effect */}
          <Animated.View 
            entering={FadeInDown.duration(400).springify().damping(12)}
            style={styles.formContainer}
          >
            {(error || validationError) && (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color="#FF3B30" />
                <Text style={styles.error}>{error || validationError}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <User size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#999"
                returnKeyType="next"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                returnKeyType="next"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#999"
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.buttonContainer,
                (!email || !password || !username || !confirmPassword || isSubmitting) && styles.buttonDisabled
              ]} 
              onPress={handleSignup}
              disabled={!email || !password || !username || !confirmPassword || isSubmitting}
            >
              <LinearGradient
                colors={['#333', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <ArrowRight size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Social sign-in options */}
            <View style={styles.socialContainer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.socialButtonsRow}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialSignup('google')}
                >
                  <GoogleLogo />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialSignup('linkedin')}
                >
                  <Linkedin size={22} color="#0A66C2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialSignup('github')}
                >
                  <Github size={22} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Powered by{' '}
              <Text 
                style={{fontFamily: 'Inter-Bold', color: '#fff'}}
                onPress={() => Linking.openURL('https://busylittlepixels.com')}
              >
                busy<Text style={{color: '#FF3B30'}}>little</Text>pixels
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'center',
    padding: 24,
  },
  centerContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    borderRadius: 24,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    backdropFilter: 'blur(8px)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  error: {
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 54,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    height: '100%',
  },
  buttonContainer: {
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
  },
  button: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  socialContainer: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  loginText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  }
});