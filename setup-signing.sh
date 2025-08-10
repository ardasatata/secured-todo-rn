#!/bin/bash

# App signing setup for React Native
# Configures signing without modifying package names or bundle IDs

KEYSTORE_PASSWORD="pdtest2024"
KEY_ALIAS="pdtest"

setup_android() {
    echo "Setting up Android signing..."

    # Create keystore directory
    mkdir -p android/app/keystore

    # Generate keystore if it doesn't exist
    KEYSTORE_PATH="android/app/keystore/release.keystore"
    if [ ! -f "$KEYSTORE_PATH" ]; then
        keytool -genkeypair \
            -alias $KEY_ALIAS \
            -keyalg RSA \
            -keysize 2048 \
            -validity 10000 \
            -keystore $KEYSTORE_PATH \
            -storepass $KEYSTORE_PASSWORD \
            -keypass $KEYSTORE_PASSWORD \
            -dname "CN=PdTest, OU=Development, O=Company, L=City, ST=State, C=US" \
            -noprompt

        if [ $? -eq 0 ]; then
            echo "✓ Android keystore created"
        else
            echo "✗ Failed to create keystore"
            exit 1
        fi
    else
        echo "✓ Android keystore exists"
    fi

    # Create keystore.properties
    cat > android/keystore.properties << EOF
storeFile=keystore/release.keystore
storePassword=$KEYSTORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEYSTORE_PASSWORD
EOF

    # Update build.gradle if needed
    if ! grep -q "keystoreProperties" android/app/build.gradle; then
        # Add properties loading
        sed -i '' '1i\
def keystorePropertiesFile = rootProject.file("keystore.properties")\
def keystoreProperties = new Properties()\
if (keystorePropertiesFile.exists()) {\
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))\
}\
' android/app/build.gradle

        # Add release signing config
        sed -i '' '/signingConfigs {/a\
        release {\
            if (keystorePropertiesFile.exists()) {\
                storeFile file(keystoreProperties["storeFile"])\
                storePassword keystoreProperties["storePassword"]\
                keyAlias keystoreProperties["keyAlias"]\
                keyPassword keystoreProperties["keyPassword"]\
            }\
        }' android/app/build.gradle

        # Use release config for release builds
        sed -i '' 's/signingConfig signingConfigs.debug/signingConfig signingConfigs.release/' android/app/build.gradle
    fi

    echo "✓ Android signing configured"
}

setup_ios() {
    echo "Setting up iOS signing..."

    # Enable automatic signing for both Debug and Release
    sed -i '' 's/"CODE_SIGN_IDENTITY\[sdk=iphoneos\*\]" = "iPhone Developer";/"CODE_SIGN_STYLE" = Automatic;/g' ios/PdTest.xcodeproj/project.pbxproj

    # Try to detect development team
    TEAM_ID=$(security find-identity -v -p codesigning | grep -E "iPhone Developer|Apple Development|iOS Development" | head -1 | sed -n 's/.*(\([A-Z0-9]*\)).*/\1/p')

    if [ ! -z "$TEAM_ID" ]; then
        # Add development team to both Debug and Release configurations
        sed -i '' "/PRODUCT_BUNDLE_IDENTIFIER/a\\
				DEVELOPMENT_TEAM = $TEAM_ID;" ios/PdTest.xcodeproj/project.pbxproj

        # Also add automatic provisioning profile
        sed -i '' "/DEVELOPMENT_TEAM = $TEAM_ID;/a\\
				PROVISIONING_PROFILE_SPECIFIER = \"\";" ios/PdTest.xcodeproj/project.pbxproj

        echo "✓ iOS development team: $TEAM_ID"
        echo "✓ iOS device installation ready"
    else
        echo "✓ iOS configured for simulator"
        echo "⚠ For device installation, run: npx react-native run-ios --device"
    fi

    # Fix CocoaPods signing for device builds
    if [ -f "ios/Pods/Pods.xcodeproj/project.pbxproj" ]; then
        # Disable code signing for static libraries in Pods
        sed -i '' '/buildSettings = {/a\
				CODE_SIGNING_REQUIRED = NO;\
				CODE_SIGNING_ALLOWED = NO;' ios/Pods/Pods.xcodeproj/project.pbxproj
        echo "✓ iOS Pods signing configured"
    fi

    echo "✓ iOS signing configured"
}

update_gitignore() {
    if ! grep -q "keystore.properties" .gitignore 2>/dev/null; then
        echo "" >> .gitignore
        echo "# Signing files" >> .gitignore
        echo "android/keystore.properties" >> .gitignore
        echo "android/app/keystore/" >> .gitignore
        echo "*.p8" >> .gitignore
        echo "*.mobileprovision" >> .gitignore
    fi
}

main() {
    echo "Configuring app signing..."
    echo ""

    setup_android
    echo ""

    setup_ios
    echo ""

    update_gitignore

    echo "✓ Setup complete!"
    echo ""
    echo "Ready to build:"
    echo "  iOS Simulator:  npm run ios"
    echo "  iOS Device:     npx react-native run-ios --device"
    echo "  Android Debug:  npm run android"
    echo "  Android Release: npm run android --mode=release"
}

main
