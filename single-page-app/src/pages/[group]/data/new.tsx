import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles } from '@mui/styles';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { AttachFile } from '@mui/icons-material';

import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { AttributeValue, DataRecord } from '@/types/models';
import { RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';

import uploadData from '@/overrides/uploadData';

interface AttachmentRecord {
  [key: string]: AttributeValue | DataRecord | File | undefined;
}

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel('data');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  const filteredAttributes = model.attributes.filter(
    (x) =>
      x.name !== 'fileURL' &&
      x.name !== 'mimeType' &&
      x.name !== 'fileSize' &&
      x.name !== 'fileName'
  );

  /* STATE */

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* AUXILIARY */

  const parseAndDisplayErrorResponse = (
    error: Error | ExtendedClientError
  ): void => {
    const parsedError = parseErrorResponse(error);

    if (
      parsedError.genericError ||
      parsedError.networkError ||
      parsedError.graphqlErrors?.nonValidationErrors.length
    ) {
      showSnackbar(
        t('errors.server-error', { status: parsedError.status }),
        'error',
        parsedError
      );
    }

    // When creating or updating a record, display server validation errors
    if (parsedError.graphqlErrors?.validationErrors)
      setAjvErrors(parsedError.graphqlErrors.validationErrors);
  };

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData, formStats) => {
    const confirmAbandonChanges = (): void => {
      dialog.openConfirm({
        title: t('dialogs.modified-info'),
        message: t('dialogs.leave-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: () => router.push(`/models/data`),
      });
    };
    if (formStats.unset < formData.length) {
      confirmAbandonChanges();
    } else {
      router.push(`/models/data`);
    }
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: ActionHandler = (formData, formStats) => {
    const dataRecord = formData.reduce<AttachmentRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    dataRecord['file'] = selectedFile;

    if (!selectedFile) {
      showSnackbar(t('record-form.no-file'), 'error');
      return;
    }

    const submit = async (): Promise<void> => {
      try {
        const request = uploadData;

        const response = await zendro.request<Record<string, AttachmentRecord>>(
          request.query,
          { variables: dataRecord }
        );

        const newId = response[request.resolver][model.primaryKey];
        router.push(`/models/data/edit?id=${newId}`);
      } catch (error) {
        parseAndDisplayErrorResponse(error);
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: t('dialogs.validation-title'),
        message: t('dialogs.validation-info'),
      });
    }

    if (formStats.unset > 0) {
      const idMsg = urlQuery.id ? ` (id: ${urlQuery.id})` : '';
      return dialog.openConfirm({
        title: t('dialogs.submit-empty-info', { idMsg }),
        message: t('dialogs.submit-empty-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: submit,
      });
    }

    submit();
  };

  return (
    <ModelBouncer object="data" action="create">
      <NavTabs
        id={urlQuery.id as string}
        active={router.asPath}
        tabs={[
          {
            type: 'link',
            label: 'attributes',
            href: router.asPath,
          },
          {
            type: 'group',
            label: 'associations',
            links: [],
          },
        ]}
      />

      <AttributesForm
        attributes={filteredAttributes}
        className={classes.root}
        disabled={false}
        errors={ajvErrors}
        formId={router.asPath}
        formView="create"
        modelName="data"
        actions={{
          cancel: handleOnCancel,
          submit:
            model.permissions.create && model.apiPrivileges.create
              ? handleOnSubmit
              : undefined,
        }}
        info={
          <div className={classes.fileUpload}>
            <Tooltip
              title={`${t('record-form.upload-file')}`}
              disableInteractive
            >
              <IconButton
                className={classes.fileUploadButton}
                component="label"
              >
                <input
                  style={{ display: 'none' }}
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files && e.target.files?.length > 0
                        ? e.target.files[0]
                        : undefined
                    )
                  }
                />
                <AttachFile />
              </IconButton>
            </Tooltip>
            {selectedFile && (
              <TextField
                disabled
                variant="standard"
                label={selectedFile.name}
              />
            )}
          </div>
        }
      />
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowY: 'auto',
    },
    fileUploadButton: {
      marginRight: '1rem',
      boxShadow: theme.shadows[4],
      backgroundColor: theme.palette.grey[300],
      // color: theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: theme.palette.primary.background,
        color: theme.palette.primary.main,
      },
    },
    fileUpload: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

Record.layout = ModelLayout;
export default Record;
