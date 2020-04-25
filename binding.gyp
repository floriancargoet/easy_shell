{
  "targets": [
    {
      "target_name": "inject",
      "sources": [
        "inject/inject.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
      'conditions': [
        [
          'OS == "linux"', {
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ]
          },
          'OS == "mac"', {
            "xcode_settings": {
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            }
          }
        ]
      ]
    }
  ]
}

